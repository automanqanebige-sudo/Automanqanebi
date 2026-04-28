"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ChatPage() {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<string[]>([]);

  useEffect(() => {
    const savedMessages =
      localStorage.getItem("chatMessages");

    if (savedMessages) {
      setMessages(
        JSON.parse(savedMessages)
      );
    }
  }, []);

  const sendMessage = () => {
    if (!message) return;

    const updated = [
      ...messages,
      message,
    ];

    setMessages(updated);

    localStorage.setItem(
      "chatMessages",
      JSON.stringify(updated)
    );

    setMessage("");
  };

  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        color: "white",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Link href="/">
          <button
            style={{
              padding: 12,
              borderRadius: 12,
              border: "none",
              marginBottom: 20,
              background: "#333",
              color: "white",
            }}
          >
            ⬅ უკან
          </button>
        </Link>

        <h1
          style={{
            marginBottom: 20,
          }}
        >
          💬 ჩატი
        </h1>

        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 20,
            padding: 20,
            minHeight: 400,
            marginBottom: 20,
          }}
        >
          {messages.length === 0 && (
            <p>
              შეტყობინებები არ არის
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                background: "#0066ff",
                padding: 12,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              {msg}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <input
            placeholder="მესიჯი..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 12,
              border: "none",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              border: "none",
              background: "#00aa55",
              color: "white",
              fontWeight: "bold",
            }}
          >
            გაგზავნა
          </button>
        </div>
      </div>
    </div>
  );
}