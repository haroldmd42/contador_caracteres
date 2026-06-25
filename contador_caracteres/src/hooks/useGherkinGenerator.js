import { generateGherkin } from "../services/geminiService";
import { useState } from "react";

export default function useGherkinGenerator(){
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const generate = async (userStory, additionalData) =>{
        try {
            setLoading(true);
            setError("");

            const response = await generateGherkin(userStory, additionalData);
            setResult(response);
        } catch(err){
            console.error(err);

            setError(
                "Ha ocurrido un problema"
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        result,
        error,
        generate,
    };
}

