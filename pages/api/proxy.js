export default async function handler(req, res) {
    const { path } = req.query;

    try {
        const response = await fetch(`http://127.0.0.1:8000/storage/${path}`);
        if (!response.ok) {
            throw new Error("Failed to fetch the image");
        }

        const contentType = response.headers.get("Content-Type");
        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Type", contentType);
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ error: "Error fetching image" });
    }
}
