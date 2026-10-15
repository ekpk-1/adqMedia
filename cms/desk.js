export function structure(S) {
    return S.list()
        .title("Content")
        .items([
            S.listItem().title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("client").title("Clients"),
        ]);
}
