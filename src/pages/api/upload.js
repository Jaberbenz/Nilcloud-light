import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { filename, content } = req.body;

  if (!filename || !content) {
    return res
      .status(400)
      .json({ message: "Le nom du fichier et le contenu sont obligatoires." });
  }

  try {
    // Chemin absolu vers le dossier `docs` de Nilcloud
    const docsPath = path.join(process.cwd(), "src/pages/docs");

    // Vérifiez si le dossier `docs` existe, sinon créez-le
    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath, { recursive: true });
    }

    // Chemin complet pour enregistrer le fichier
    const filePath = path.join(docsPath, filename);

    // Sauvegarde du fichier MDX
    fs.writeFileSync(filePath, content, "utf8");

    return res
      .status(200)
      .json({ message: "Fichier MDX sauvegardé avec succès dans Nilcloud !" });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return res
      .status(500)
      .json({ message: "Erreur interne lors de la sauvegarde." });
  }
}
