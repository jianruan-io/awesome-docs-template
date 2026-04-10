/**
 * Remark plugin that auto-imports React components used in MDX files.
 * This avoids needing explicit import statements in every MDX file.
 */

const AUTO_IMPORTS = [
  {
    component: "MermaidDiagram",
    source: "@components/MermaidDiagram",
    defaultImport: true,
  },
];

export default function remarkAutoImport() {
  return (tree, file) => {
    const content = file.value || "";

    const needed = AUTO_IMPORTS.filter((imp) =>
      content.includes(`<${imp.component}`)
    );

    if (needed.length === 0) return;

    // Add import nodes at the beginning of the MDX AST
    const imports = needed.map((imp) => ({
      type: "mdxjsEsm",
      value: imp.defaultImport
        ? `import ${imp.component} from '${imp.source}';`
        : `import { ${imp.component} } from '${imp.source}';`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ImportDeclaration",
              source: {
                type: "Literal",
                value: imp.source,
                raw: `'${imp.source}'`,
              },
              specifiers: imp.defaultImport
                ? [
                    {
                      type: "ImportDefaultSpecifier",
                      local: {
                        type: "Identifier",
                        name: imp.component,
                      },
                    },
                  ]
                : [
                    {
                      type: "ImportSpecifier",
                      imported: {
                        type: "Identifier",
                        name: imp.component,
                      },
                      local: {
                        type: "Identifier",
                        name: imp.component,
                      },
                    },
                  ],
            },
          ],
        },
      },
    }));

    tree.children.unshift(...imports);
  };
}
