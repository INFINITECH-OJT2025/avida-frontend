export default async function handler(req, res) {
    const { path } = req.query;

    try {
        const response = await fetch(`https://infinitech-api3.site/storage/${path}`);
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
