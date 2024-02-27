import axios, { AxiosResponse, AxiosError } from 'axios'
import { AIMessage, BaseMessage } from '@langchain/core/messages'
import { ChatResult } from '@langchain/core/outputs'
import { BaseChatModel, BaseChatModelCallOptions, BaseChatModelParams } from '@langchain/core/language_models/chat_models'
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager'

export interface LlmGwOptions extends BaseChatModelCallOptions {}

export interface LlmGwParams extends BaseChatModelParams {
    apiKey: string
    modelname: string
}

export class LlmGw extends BaseChatModel<LlmGwOptions> {
    private apiKey: string
    private modelname: string

    static lc_name(): string {
        return 'LlmGw'
    }

    constructor(fields: LlmGwParams) {
        super(fields)
        this.apiKey = fields.apiKey
        this.modelname = fields.modelname
    }

    private get apiUrl(): string {
        return 'https://llmgw.prod.applied-ai.comcast.net/aai-llm-gw/chat'
    }

    async _generate(
        messages: BaseMessage[],
        options: this['ParsedCallOptions'],
        runManager?: CallbackManagerForLLMRun
    ): Promise<ChatResult> {
        if (!messages.length) {
            throw new Error('No messages provided.')
        }
        if (typeof messages[0].content !== 'string') {
            throw new Error('Multimodal messages are not supported.')
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
        }

        const requestData = {
            messages: [
                {
                    role: 'user',
                    content: messages[0].content
                }
            ],
            model_id: this.modelname
        }

        try {
            const response: AxiosResponse = await axios.post(this.apiUrl, requestData, { headers })

            // Handle the response data as needed

            // Mocking the ChatResult structure, adjust as needed
            const chatResult: ChatResult = {
                generations: [
                    {
                        message: new AIMessage({ content: response.data.choices[0].message.content }),
                        text: response.data.choices[0].message.content
                    }
                ],
                llmOutput: {
                    tokenUsage: {
                        usedTokens: response.data.usage.total_tokens
                    }
                }
            }

            return chatResult
        } catch (error) {
            const axiosError: AxiosError = error
            console.error('Error:', axiosError.message || axiosError)
            // Handle errors

            // Mocking the ChatResult structure for error case, adjust as needed
            const errorChatResult: ChatResult = {
                generations: [
                    {
                        message: new AIMessage({ content: 'Error occurred' }),
                        text: 'Error occurred'
                    }
                ],
                llmOutput: {
                    tokenUsage: {
                        usedTokens: 0 // or some default value
                    }
                }
            }

            return errorChatResult
        }
    }

    _llmType(): string {
        return 'llm_gw'
    }
}
