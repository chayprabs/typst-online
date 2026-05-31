from typstbox_worker.compiler import _parse_diagnostics


def test_typst13_error_parsing():
    stderr = """error: unknown variable: foo
  ┌─ main.typ:2:1
  │
2 │ #foo()
  │  ^^^
"""
    diags = _parse_diagnostics(stderr, "")
    assert len(diags) >= 1
    assert diags[0].severity == "error"
    assert diags[0].file == "main.typ"
    assert diags[0].line == 2
    assert "foo" in diags[0].message


def test_typst13_warning_parsing():
    stderr = """warning: unknown font family: linux libertine
  ┌─ main.typ:2:16
  │
2 │ #set text(font: "Linux Libertine")
  │                 ^^^^^^^^^^^^^^^^
"""
    diags = _parse_diagnostics(stderr, "")
    assert len(diags) >= 1
    assert diags[0].severity == "warning"
    assert diags[0].file == "main.typ"
