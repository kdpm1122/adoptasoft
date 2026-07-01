// src/presentation/components/sections/MessagesSection.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { messageRepository } from "../../../infrastructure/repositories/messageRepository";

const POLL_MS = 4000;

export function MessagesSection({ contacts = [] }) {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await messageRepository.conversations();
      setConversations(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadMessages = useCallback(async (contactId) => {
    if (!contactId) return;
    try {
      const data = await messageRepository.list(contactId);
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, POLL_MS * 2);
    return () => clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedId) return;
    loadMessages(selectedId);
    const interval = setInterval(() => loadMessages(selectedId), POLL_MS);
    return () => clearInterval(interval);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const knownIds = new Set(conversations.map((c) => c.contactId));
  const pendingContacts = contacts.filter((c) => !knownIds.has(c.id));
  const contactList = [
    ...conversations.map((c) => ({
      id: c.contactId,
      name: c.contactName,
      role: c.contactRole,
      lastMessage: c.lastMessage,
      unread: c.unread,
    })),
    ...pendingContacts.map((c) => ({ id: c.id, name: c.name, role: c.role, lastMessage: null, unread: 0 })),
  ];

  async function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !selectedId) return;
    setIsSending(true);
    setError(null);
    try {
      const sent = await messageRepository.send(selectedId, draft.trim());
      setMessages((prev) => [...prev, { ...sent, mine: true }]);
      setDraft("");
      loadConversations();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  }

  const selectedContact = contactList.find((c) => String(c.id) === String(selectedId));

  return (
    <div className="flex h-[70vh] overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <aside className="flex w-full max-w-[260px] flex-col border-r border-border">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold text-text-dark">💬 Mensajes</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contactList.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-text-muted">
              No hay contactos disponibles todavía.
            </p>
          )}
          {contactList.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex w-full flex-col items-start gap-0.5 border-b border-border px-4 py-3 text-left transition-colors
                ${String(selectedId) === String(c.id) ? "bg-primary-light/30" : "hover:bg-warm-cream"}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-text-dark">{c.name}</span>
                {c.unread > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
              <span className="w-full truncate text-xs text-text-muted">
                {c.lastMessage || "Iniciar conversación"}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {!selectedContact ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-text-muted">Selecciona una conversación para empezar</p>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-text-dark">{selectedContact.name}</p>
              <p className="text-xs text-text-muted">
                {selectedContact.role === "vet" ? "Veterinario" : selectedContact.role === "owner" ? "Dueño" : "Admin"}
              </p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm
                      ${m.mine ? "bg-primary text-white" : "border border-border bg-warm-cream text-text-dark"}`}
                  >
                    <p>{m.message}</p>
                    <p className={`mt-1 text-[10px] ${m.mine ? "text-white/70" : "text-text-muted"}`}>
                      {new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {error && <p className="px-4 pb-1 text-xs text-red-500">{error}</p>}

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border px-4 py-3">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 rounded-xl border border-border bg-warm-cream px-4 py-2 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button
                type="submit"
                disabled={isSending || !draft.trim()}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary-dark disabled:opacity-60"
              >
                Enviar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
