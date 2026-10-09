package com.resumeai.service;

import com.resumeai.model.SessionData;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionStore {

    private final Map<String, SessionData> store = new ConcurrentHashMap<>();

    public String createSession(SessionData data) {
        String id = UUID.randomUUID().toString();
        store.put(id, data);
        return id;
    }

    public SessionData get(String sessionId) {
        return store.get(sessionId);
    }

    public boolean exists(String sessionId) {
        return store.containsKey(sessionId);
    }
}
