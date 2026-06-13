export interface EventListener<TPayload> {
  update(payload: TPayload): Promise<void>;
}

export class EventManager<TEventMap extends Record<string, unknown>> {
  private readonly listeners = new Map<keyof TEventMap, EventListener<TEventMap[keyof TEventMap]>[]>();

  subscribe<TEventName extends keyof TEventMap>(
    eventName: TEventName,
    listener: EventListener<TEventMap[TEventName]>,
  ): void {
    const eventListeners = this.listeners.get(eventName) ?? [];
    eventListeners.push(listener as EventListener<TEventMap[keyof TEventMap]>);
    this.listeners.set(eventName, eventListeners);
  }

  unsubscribe<TEventName extends keyof TEventMap>(
    eventName: TEventName,
    listener: EventListener<TEventMap[TEventName]>,
  ): void {
    const eventListeners = this.listeners.get(eventName) ?? [];
    this.listeners.set(
      eventName,
      eventListeners.filter((current) => current !== listener),
    );
  }

  async notify<TEventName extends keyof TEventMap>(
    eventName: TEventName,
    payload: TEventMap[TEventName],
  ): Promise<void> {
    const eventListeners = this.listeners.get(eventName) ?? [];

    for (const listener of eventListeners) {
      await (listener as EventListener<TEventMap[TEventName]>).update(payload);
    }
  }
}
