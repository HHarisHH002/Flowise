import { OpenAIEmbeddingsParams } from '@langchain/openai'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { LlmGwEmbeddings, LlmGwEmbeddingsParams } from './llm'
class LLMGwEmbedding_Embeddings implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'LlmGateway Embeddings'
        this.name = 'llmGatewayEmbeddings'
        this.version = 1.0
        this.type = 'LLMGatewayEmbeddings'
        this.icon = 'Azure.svg'
        this.category = 'Embeddings'
        this.description = 'LLM Gateway to generate embeddings for a given text'
        this.baseClasses = [this.type, ...getBaseClasses(LlmGwEmbeddings)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['llmGatewayApi']
        }
        this.inputs = [
            {
                label: 'Batch Size',
                name: 'batchSize',
                type: 'number',
                default: '100',
                optional: true,
                additionalParams: true
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const batchSize = nodeData.inputs?.batchSize as string
        const timeout = nodeData.inputs?.timeout as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const BearerToken = getCredentialParam('LlmGatewayApiKey', credentialData, nodeData)

        const obj: LlmGwEmbeddingsParams & Partial<OpenAIEmbeddingsParams> = {
            bearerToken: BearerToken
        }

        if (batchSize) obj.batchSize = parseInt(batchSize, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new LlmGwEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: LLMGwEmbedding_Embeddings }
