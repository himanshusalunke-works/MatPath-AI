const { getUserProfile, updateUserProfile } = require('../../src/services/firestoreService');
const { db } = require('../../src/config/firebase');

jest.mock('../../src/config/firebase', () => ({
    db: {
        collection: jest.fn()
    }
}));

describe('firestoreService', () => {
    let mockDoc;
    let mockGet;
    let mockSet;

    beforeEach(() => {
        mockGet = jest.fn();
        mockSet = jest.fn();
        mockDoc = {
            get: mockGet,
            set: mockSet
        };
        db.collection.mockReturnValue({
            doc: jest.fn().mockReturnValue(mockDoc)
        });
    });

    describe('getUserProfile', () => {
        it('should return profile data if document exists', async () => {
            const mockData = { name: 'John Doe' };
            mockGet.mockResolvedValue({
                exists: true,
                data: () => mockData
            });

            const result = await getUserProfile('uid123');
            expect(result).toEqual(mockData);
        });

        it('should return null if document does not exist', async () => {
            mockGet.mockResolvedValue({
                exists: false
            });

            const result = await getUserProfile('uid123');
            expect(result).toBeNull();
        });
    });

    describe('updateUserProfile', () => {
        it('should call set with merge true', async () => {
            const data = { age: 30 };
            mockSet.mockResolvedValue(true);

            await updateUserProfile('uid123', data);
            expect(mockSet).toHaveBeenCalledWith(data, { merge: true });
        });
    });
});
