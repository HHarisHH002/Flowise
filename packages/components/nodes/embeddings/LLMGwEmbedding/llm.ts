import axios, { AxiosResponse, AxiosError } from 'axios'
import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings'
import { OpenAIEmbeddingsParams } from '@langchain/openai'
export interface LlmGwEmbeddingsParams extends EmbeddingsParams {
    bearerToken: string
}

export class LlmGwEmbeddings extends Embeddings implements LlmGwEmbeddingsParams {
    bearerToken: string

    constructor(fields: Partial<OpenAIEmbeddingsParams> & LlmGwEmbeddingsParams) {
        super(fields)
        this.bearerToken = fields.bearerToken
    }

    private apiUrl = 'https://llmgw.prod.applied-ai.comcast.net/aai-llm-gw/embeddings'

    private postRequest(text: string): Promise<number[]> {
        const headers = {
            Authorization: `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json'
        }

        const data = {
            text: text.replace('\n', ' '),
            model_id: 'Databricks_ADA2'
        }

        return axios
            .post(this.apiUrl, data, { headers })
            .then((response: AxiosResponse) => response.data.data[0].embedding)
            .catch((error: AxiosError) => {
                console.error('Error:', error)
                throw new Error('Error occurred during API request.')
            })
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        try {
            const embeddings = await Promise.all(texts.map((text) => this.postRequest(text)))
            return embeddings
        } catch (error) {
            console.error('Error:', error)
            throw new Error('Error occurred during embedding.')
        }
    }

    async embedQuery(text: string): Promise<number[]> {
        try {
            const embedding = await this.postRequest(text)
            return embedding
        } catch (error) {
            console.error('Error:', error)
            throw new Error('Error occurred during embedding.')
        }
    }
}
