import { renderHook } from '@testing-library/react';
import { useOnWindowResize } from '@/shared/hooks/useOnWindowResize';

describe('useOnWindowResize', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('calls handler immediately on mount', () => {
    const handler = jest.fn();

    renderHook(() => useOnWindowResize(handler));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('adds resize event listener to window on mount', () => {
    const handler = jest.fn();

    renderHook(() => useOnWindowResize(handler));

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('calls handler when window is resized', () => {
    const handler = jest.fn();

    renderHook(() => useOnWindowResize(handler));

    // Handler is called once on mount
    expect(handler).toHaveBeenCalledTimes(1);

    // Simulate window resize
    window.dispatchEvent(new Event('resize'));

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('calls handler multiple times on multiple resize events', () => {
    const handler = jest.fn();

    renderHook(() => useOnWindowResize(handler));

    // Handler is called once on mount
    expect(handler).toHaveBeenCalledTimes(1);

    // Simulate multiple window resizes
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));

    expect(handler).toHaveBeenCalledTimes(4); // 1 initial + 3 resize events
  });

  it('removes resize event listener on unmount', () => {
    const handler = jest.fn();

    const { unmount } = renderHook(() => useOnWindowResize(handler));

    expect(removeEventListenerSpy).not.toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('does not call handler after unmount', () => {
    const handler = jest.fn();

    const { unmount } = renderHook(() => useOnWindowResize(handler));

    // Handler is called once on mount
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();

    // Simulate window resize after unmount
    window.dispatchEvent(new Event('resize'));

    // Handler should not be called again
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('updates handler when it changes', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const { rerender } = renderHook(
      ({ handler }) => useOnWindowResize(handler),
      { initialProps: { handler: handler1 } }
    );

    // First handler is called on mount
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(0);

    // Trigger resize with first handler
    window.dispatchEvent(new Event('resize'));
    expect(handler1).toHaveBeenCalledTimes(2);
    expect(handler2).toHaveBeenCalledTimes(0);

    // Rerender with new handler
    rerender({ handler: handler2 });

    // New handler is called immediately
    expect(handler2).toHaveBeenCalledTimes(1);

    // Trigger resize with new handler
    window.dispatchEvent(new Event('resize'));
    expect(handler2).toHaveBeenCalledTimes(2);
    
    // Old handler should not be called anymore
    expect(handler1).toHaveBeenCalledTimes(2);
  });

  it('cleans up old event listener when handler changes', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    const { rerender } = renderHook(
      ({ handler }) => useOnWindowResize(handler),
      { initialProps: { handler: handler1 } }
    );

    // Verify initial setup
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

    // Rerender with new handler
    rerender({ handler: handler2 });

    // Should remove old listener and add new one
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });

  it('works with handler that modifies state', () => {
    let count = 0;
    const handler = jest.fn(() => {
      count++;
    });

    renderHook(() => useOnWindowResize(handler));

    expect(count).toBe(1);

    window.dispatchEvent(new Event('resize'));
    expect(count).toBe(2);

    window.dispatchEvent(new Event('resize'));
    expect(count).toBe(3);
  });

  it('handles errors in handler gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const handler = jest.fn(() => {
      throw new Error('Handler error');
    });

    expect(() => {
      renderHook(() => useOnWindowResize(handler));
    }).toThrow('Handler error');

    consoleErrorSpy.mockRestore();
  });

  it('works with async handler', async () => {
    const handler = jest.fn(async () => {
      await Promise.resolve();
    });

    renderHook(() => useOnWindowResize(handler));

    expect(handler).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event('resize'));

    expect(handler).toHaveBeenCalledTimes(2);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('adds and removes same event listener function reference', () => {
    const handler = jest.fn();

    const { unmount } = renderHook(() => useOnWindowResize(handler));

    const addedListener = addEventListenerSpy.mock.calls[0][1];
    
    unmount();

    const removedListener = removeEventListenerSpy.mock.calls[0][1];

    // Verify the same function reference is used for add and remove
    expect(addedListener).toBe(removedListener);
  });

  it('can be used multiple times with different handlers', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    renderHook(() => useOnWindowResize(handler1));
    renderHook(() => useOnWindowResize(handler2));

    // Both handlers called on mount
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    // Trigger resize
    window.dispatchEvent(new Event('resize'));

    // Both handlers should be called
    expect(handler1).toHaveBeenCalledTimes(2);
    expect(handler2).toHaveBeenCalledTimes(2);
  });
});
