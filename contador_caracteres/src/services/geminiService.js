const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://contador-back-xeq3.onrender.com');

export async function generateGherkin(
    userStory,
    additionalData,
    mode = "gherkin",
    framework = "cypress"
) {
    const res = await fetch(
        `${API_BASE_URL}/api/gemini`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userStory,
                additionalData,
                mode,
                framework,
            }),
        }
    );

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.message || "Error en backend");
    }

    return data.data;
}