import { Groq } from 'groq-sdk';

export const groqService = async (prompt) => {

    const groq = new Groq({ timeout: 10000, maxRetries: 1 }); // max 10 segundos, 1 reintento (OWASP #10: evitar cuelgues)

    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "openai/gpt-oss-120b",
        "temperature": 1,
        "max_completion_tokens": 2048,
        "top_p": 1,
        "stream": true,
        "reasoning_effort": "medium",
        "stop": null
    });

    let result = '';

    for await (const chunk of chatCompletion) {
        result += chunk.choices[0]?.delta?.content || '';
    }

    return result;
}

export const generarDescripcionService = async (titulo, categoria) => {
    const prompt = `Escribí una descripción corta (máximo 3 oraciones) y atractiva para vender este producto en un marketplace. ` +
        `No inventes datos técnicos que no estén en el título. Respondé solo con la descripción, sin comillas ni títulos. ` +
        `Producto: ${titulo}. Categoría: ${categoria}.`;
    try {
        const descripcion = await groqService(prompt);
        if (!descripcion.trim()) {
            throw new Error("La IA devolvió una respuesta vacía");
        }
        return { descripcion: descripcion.trim(), generadaPorIA: true };
    } catch (error) {
 
        console.error("Error al generar descripción con IA:", error.message);
        const descripcionGenerica = `${titulo} en venta. Categoría: ${categoria}. Consultá al vendedor por más detalles.`;
        return { descripcion: descripcionGenerica, generadaPorIA: false };
    }
}