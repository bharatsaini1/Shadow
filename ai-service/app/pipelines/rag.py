import json
import numpy as np
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from app.config import get_settings

EMBED_DIM = 384

_model = None


def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


class _VectorStore:
    def __init__(self):
        self.use_pinecone = False
        self.in_memory = {"documents": [], "embeddings": []}

        settings = get_settings()
        api_key = settings.pinecone_api_key
        index_name = settings.pinecone_index_name
        env = settings.pinecone_environment
        host = settings.pinecone_host

        if api_key:
            try:
                kwargs = {"api_key": api_key}
                if host:
                    kwargs["host"] = host
                pc = Pinecone(**kwargs)
                if not host and not pc.has_index(index_name):
                    pc.create_index(
                        name=index_name,
                        dimension=EMBED_DIM,
                        metric="cosine",
                        spec=ServerlessSpec(cloud="aws", region=env),
                    )
                self.index = pc.Index(index_name)
                self.use_pinecone = True
            except Exception:
                self.use_pinecone = False

    def query(self, vector: list, top_k: int = 3, namespace: str = "",
              include_metadata: bool = True) -> dict:
        if self.use_pinecone:
            try:
                return self.index.query(
                    vector=vector, top_k=top_k, namespace=namespace,
                    include_metadata=include_metadata,
                )
            except Exception:
                return {"matches": []}

        if not self.in_memory["documents"]:
            return {"matches": []}

        indices = [i for i, d in enumerate(self.in_memory["documents"])
                   if not namespace or d["metadata"].get("namespace") == namespace]
        if not indices:
            return {"matches": []}

        all_embeds = np.array(self.in_memory["embeddings"])
        qv = np.array(vector)
        dots = np.dot(all_embeds[indices], qv)
        norms = np.linalg.norm(all_embeds[indices], axis=1) * np.linalg.norm(qv) + 1e-10
        sims = dots / norms
        top = np.argsort(sims)[-top_k:][::-n]

        matches = []
        for pos in top:
            idx = indices[pos]
            d = self.in_memory["documents"][idx]
            matches.append({
                "id": d["id"],
                "score": float(sims[pos]),
                "metadata": d["metadata"],
            })
        return {"matches": matches}


_vector_store = _VectorStore()


def embed(text: str) -> list[float]:
    model = _get_model()
    return model.encode(text, normalize_embeddings=True).tolist()


def retrieve(namespace: str, query: str, top_k: int = 3) -> str:
    try:
        query_vector = embed(query)
        results = _vector_store.query(
            vector=query_vector,
            top_k=top_k,
            namespace=namespace,
            include_metadata=True,
        )
        chunks = []
        for match in results.get("matches", []):
            meta = match.get("metadata", {})
            text = meta.get("text", json.dumps(meta))
            if text:
                chunks.append(text)
        return "\n\n".join(chunks)
    except Exception:
        return ""


async def get_career_context(role: str, query: str) -> str:
    return retrieve("career_knowledge", f"{role} {query}")


async def get_task_templates(role: str, task_type: str) -> str:
    return retrieve("task_templates", f"{role} {task_type}")


async def get_evaluation_rubric(task_type: str) -> str:
    return retrieve("evaluation_rubrics", task_type)


async def get_interview_questions(role: str, interview_type: str) -> str:
    return retrieve("interview_questions", f"{role} {interview_type}")
