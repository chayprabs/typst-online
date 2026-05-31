from .models import Project, ProjectFile

TEMPLATES: dict[str, dict] = {
    "resume-modern": {
        "title": "Modern Resume",
        "description": "Clean single-page resume",
        "category": "resume",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(margin: 1.2cm)
#set text(font: "Linux Libertine", size: 11pt)
#align(center)[
  *Alex Morgan* \\
  alex@example.com · github.com/alex
]
#v(1em)
== Experience
- *TypstBox* — Built online Typst tooling
- *Example Co* — Document automation
== Education
- B.S. Computer Science, Example University
''',
            }
        ],
    },
    "resume-classic": {
        "title": "Classic Resume",
        "description": "Traditional two-column resume",
        "category": "resume",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(margin: 1.5cm)
#set text(font: "Noto Serif", size: 10.5pt)
#grid(
  columns: (1fr, 2fr),
  gutter: 1em,
  [
    *Jordan Lee* \\
    jordan@example.com
    #v(1em)
    == Skills
    - Typst
    - Rust
  ],
  [
    == Profile
    Typesetting specialist.
    == Work
    - Consultant, 2020–present
  ],
)
''',
            }
        ],
    },
    "paper-ieee": {
        "title": "IEEE Paper",
        "description": "Conference paper layout",
        "category": "paper",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(paper: "us-letter", margin: 1in)
#set text(font: "Linux Libertine", size: 10pt)
#align(center)[
  *TypstBox: Online Typst Compilation* \\
  _Chaitanya Prabuddha_
]
#v(1em)
= Abstract
We present a web playground for Typst with live PDF preview.
= Introduction
Typst offers a modern alternative to LaTeX for technical documents.
''',
            }
        ],
    },
    "report": {
        "title": "Business Report",
        "description": "Structured report with sections",
        "category": "report",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(margin: 2cm)
#set heading(numbering: "1.")
= Quarterly Report
#lorem(40)
== Highlights
- Revenue up 12%
- New Typst templates shipped
''',
            }
        ],
    },
    "invoice": {
        "title": "Invoice",
        "description": "Simple invoice template",
        "category": "invoice",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(margin: 1.5cm)
#align(right)[Invoice #1234 · May 31, 2026]
#v(1em)
*Bill to:* Example Client \\
*From:* TypstBox LLC
#table(
  columns: (1fr, auto, auto),
  [*Item*, *Qty*, *Total*],
  [Consulting, 10, $5000],
  [Hosting, 1, $200],
)
#align(right)[*Total: $5200*]
''',
            }
        ],
    },
    "slides": {
        "title": "Slides",
        "description": "Presentation deck",
        "category": "slides",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(width: 320pt, height: 180pt, margin: 1cm)
#set align(center)
= TypstBox
== Live Typst in the browser
- Compile to PDF
- Pin compiler versions
#pagebreak()
== Thank you
Questions?
''',
            }
        ],
    },
    "letter": {
        "title": "Letter",
        "description": "Formal business letter",
        "category": "letter",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(margin: 2.5cm)
#set text(font: "Linux Libertine", size: 11pt)
May 31, 2026

Dear Reader,

TypstBox makes it easy to typeset professional documents online.

Sincerely,\\
The TypstBox Team
''',
            }
        ],
    },
    "thesis": {
        "title": "Thesis Chapter",
        "description": "Academic chapter starter",
        "category": "thesis",
        "files": [
            {
                "path": "main.typ",
                "content": '''#set page(margin: 2.5cm)
#set heading(numbering: "1.1")
= Chapter 3: Methods
This chapter describes the compilation pipeline.
== Toolchain
We invoke typst-cli in an ephemeral per-project directory.
''',
            }
        ],
    },
}


def get_template_project(template_id: str, project_id: str) -> Project | None:
    meta = TEMPLATES.get(template_id)
    if not meta:
        return None
    return Project(
        id=project_id,
        files=[ProjectFile(**f) for f in meta["files"]],
        fonts=[],
        packages=[],
        compilerVersion="0.13.1",
        mainPath="main.typ",
    )


def list_templates() -> list[dict]:
    return [
        {
            "id": tid,
            "title": m["title"],
            "description": m["description"],
            "category": m["category"],
        }
        for tid, m in TEMPLATES.items()
    ]
