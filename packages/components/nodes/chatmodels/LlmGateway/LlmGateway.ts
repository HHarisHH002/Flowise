import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { BaseCache } from 'langchain/schema'
import { LlmGw, LlmGwParams } from './llm'

interface llmgatewayConfig {
    LlmGatewayApiKey?: string
}

class LlmGateway_ChatModels implements INode {
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
        this.label = 'Llm Gateway'
        this.name = 'llmGateway'
        this.version = 2.0
        this.type = 'LlmGateway'
        this.icon = 'Azure.svg'
        this.category = 'Chat Models'
        this.description = 'Wrapper around LlmGateway  that use the Chat endpoint'
        this.baseClasses = [this.type, ...getBaseClasses(LlmGw)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['llmGatewayApi']
        }
        this.inputs = [
            {
                label: 'Cache',
                name: 'cache',
                type: 'BaseCache',
                optional: true
            },
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'Databricks_GPT35_Turbo',
                        name: 'Databricks_GPT35_Turbo'
                    }
                ],
                default: 'Databricks_GPT35_Turbo',
                optional: false
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.9,
                optional: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Frequency Penalty',
                name: 'frequencyPenalty',
                type: 'number',
                step: 0.1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Presence Penalty',
                name: 'presencePenalty',
                type: 'number',
                step: 0.1,
                optional: true,
                additionalParams: true
            },
            {
                label: 'Timeout',
                name: 'timeout',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const modelName = nodeData.inputs?.modelName as string
        const temperature = nodeData.inputs?.temperature as string
        const maxTokens = nodeData.inputs?.maxTokens as string
        const frequencyPenalty = nodeData.inputs?.frequencyPenalty as string
        const presencePenalty = nodeData.inputs?.presencePenalty as string
        const timeout = nodeData.inputs?.timeout as string
        const streaming = nodeData.inputs?.streaming as boolean
        const cache = nodeData.inputs?.cache as BaseCache

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const LlmGatewayApiKey = getCredentialParam('LlmGatewayApiKey', credentialData, nodeData)

        const obj: LlmGwParams & { llmgatewayConfig?: llmgatewayConfig } = {
            apiKey: LlmGatewayApiKey,
            modelname: modelName
        }

        const model = new LlmGw(obj)
        return model
    }
}

module.exports = { nodeClass: LlmGateway_ChatModels }
