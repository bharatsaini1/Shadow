from django.db import migrations


def seed_career_tracks(apps, schema_editor):
    CareerTrack = apps.get_model("simulations", "CareerTrack")
    tracks = [
        {
            "name": "MERN Stack Developer",
            "slug": "mern-stack-developer",
            "description": "Full-stack development with MongoDB, Express, React, and Node.js. Build REST APIs, design database schemas, and craft responsive UIs.",
            "difficulty_level": "intermediate",
        },
        {
            "name": "Frontend Developer",
            "slug": "frontend-developer",
            "description": "Modern frontend with React, TypeScript, and CSS architecture. Master component design, state management, and responsive layouts.",
            "difficulty_level": "beginner",
        },
        {
            "name": "UI/UX Designer",
            "slug": "ui-ux-designer",
            "description": "Design systems, user research, prototyping, and handoff. Create intuitive interfaces and delightful user experiences.",
            "difficulty_level": "beginner",
        },
        {
            "name": "Data Analyst",
            "slug": "data-analyst",
            "description": "SQL, Python, visualization, and business intelligence. Extract insights from data and communicate findings to stakeholders.",
            "difficulty_level": "beginner",
        },
        {
            "name": "Backend Developer",
            "slug": "backend-developer",
            "description": "API design, databases, authentication, and system architecture. Build scalable server-side applications and microservices.",
            "difficulty_level": "intermediate",
        },
        {
            "name": "HR Executive",
            "slug": "hr-executive",
            "description": "Recruitment, employee relations, performance management, and HR operations. Learn real-world HR workflows and compliance.",
            "difficulty_level": "beginner",
        },
    ]
    for track_data in tracks:
        CareerTrack.objects.get_or_create(
            slug=track_data["slug"], defaults=track_data
        )


def reverse_seed(apps, schema_editor):
    CareerTrack = apps.get_model("simulations", "CareerTrack")
    CareerTrack.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("simulations", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(seed_career_tracks, reverse_seed),
    ]
