const { generateChatResponse } = require('../../src/services/groqService');
const { Groq } = require('groq-sdk');

jest.mock('groq-sdk');

describe('groqService', () => {
    let mockCreate;

    beforeEach(() => {
        mockCreate = jest.fn();
        Groq.prototype.chat = {
            completions: {
                create: mockCreate
            }
        };
    });

    it('should generate a chat response successfully', async () => {
        const mockResponse = { choices: [{ message: { content: 'Test response' } }] };
        mockCreate.mockResolvedValue(mockResponse);

        const messages = [{ role: 'user', content: 'hello' }];
        const response = await generateChatResponse(messages, 'llama3-8b-8192', false);

        expect(response).toEqual(mockResponse);
        expect(mockCreate).toHaveBeenCalledWith({
            messages,
            model: 'llama3-8b-8192',
            stream: false
        });
    });

    it('should throw an error if Groq fails', async () => {
        const mockError = new Error('Groq error');
        mockCreate.mockRejectedValue(mockError);

        const messages = [{ role: 'user', content: 'hello' }];
        await expect(generateChatResponse(messages)).rejects.toThrow('Groq error');
    });
});
