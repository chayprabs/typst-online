/** Minimal Typst syntax highlighting for Monaco (community-style grammar subset). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerTypstLanguage(monaco: any) {
  const id = "typst";
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === id)) return;

  monaco.languages.register({ id });

  monaco.languages.setMonarchTokensProvider(id, {
    defaultToken: "",
    tokenPostfix: ".typst",
    keywords: [
      "let",
      "set",
      "show",
      "if",
      "else",
      "for",
      "while",
      "in",
      "not",
      "and",
      "or",
      "return",
      "break",
      "continue",
      "import",
      "include",
      "as",
      "where",
    ],
    tokenizer: {
      root: [
        [/\/\/.*$/, "comment"],
        [/\/\*[\s\S]*?\*\//, "comment"],
        [/"[^"]*"/, "string"],
        [/#(let|set|show|import|include)\b/, "keyword"],
        [/=+/, "heading"],
        [/\$[^$]+\$/, "string"],
        [/\b\d+(\.\d+)?(pt|mm|cm|in|em|fr|%)?\b/, "number"],
        [
          /\b(let|set|show|if|else|for|while|in|not|and|or|import|include|as|where)\b/,
          "keyword",
        ],
        [/[a-zA-Z_][\w-]*/, "identifier"],
      ],
    },
  });
}
