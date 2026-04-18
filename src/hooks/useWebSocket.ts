import { useEffect, useRef } from "react";
import { USER_ID } from "../api/client";
import { WSEvent } from "../types";
import { postStore } from "../stores/PostStore";

const WS_URL = `wss://k8s.mectest.ru/test-app/ws?token=${USER_ID}`;
const RECONNECT_DELAY = 3000;

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const connect = () => {
    if (!isMounted.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] connected");
    };

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as WSEvent;
        if (event.type === "ping") return;
        postStore.handleWSEvent(event);
      } catch {
        console.warn("[WS] failed to parse message", e.data);
      }
    };

    ws.onclose = () => {
      console.log("[WS] disconnected, reconnecting...");
      if (isMounted.current) {
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
      }
    };

    ws.onerror = (e) => {
      console.warn("[WS] error", e);
      ws.close();
    };
  };

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);
};
