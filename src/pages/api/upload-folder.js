import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // Ajouter les en-têtes CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet toutes les origines (vous pouvez restreindre à une origine spécifique si nécessaire)
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Gérer les requêtes OPTIONS pour les pré-vols CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { folderName, files } = req.body;

  if (!folderName || !files || !Array.isArray(files)) {
    return res
      .status(400)
      .json({ message: "Nom du dossier et fichiers requis." });
  }

  try {
    // Chemin absolu vers le dossier cible
    const basePath = path.join(process.cwd(), "src/pages/docs", folderName);

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    // Créer les fichiers dans le dossier
    files.forEach((file) => {
      const filePath = path.join(basePath, file.filename);
      fs.writeFileSync(filePath, file.content, "utf8");
    });

    return res
      .status(200)
      .json({ message: "Dossier et fichiers sauvegardés avec succès." });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return res.status(500).json({ message: "Erreur interne." });
  }
}
