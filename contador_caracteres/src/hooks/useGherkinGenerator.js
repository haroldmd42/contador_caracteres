import { generateGherkin } from "../services/geminiService";
import { useState } from "react";

export default function useGherkinGenerator(){
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const generate = async (userStory, additionalData, mode = "gherkin", framework = "cypress") =>{
        try {
            setLoading(true);
            setError("");

            const response = await generateGherkin(userStory, additionalData, mode, framework);
            setResult(response);
        } catch(err){
            console.error(err);

            setError(
                "Ha ocurrido un problema al comunicarse con la IA"
            );
        } finally {
            setLoading(false);
        }
    };


    const clearResult = () => {
        setResult("");
        setError("");
    };

    return {
        loading,
        result,
        error,
        generate,
        clearResult,
    };
}


