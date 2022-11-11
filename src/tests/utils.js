
export function setupMockIntersectionObserver({
    observe = () => null, 
    unobserve = () => null,
    disconnect = () => null,
    rootMargin = "",
    thresholds = [], 
} = {}){

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
        observe,
        unobserve,
        disconnect,
        rootMargin,
        thresholds,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    return mockIntersectionObserver;
}
