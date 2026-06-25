export async function generateGherkin(
    userStory,
    additionalData
) {
    const res = await fetch(
        "https://contador-back-xeq3.onrender.com/api/gemini",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userStory,
                additionalData,
            }),
        }
    );

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.message || "Error en backend");
    }

    return data.data;
}