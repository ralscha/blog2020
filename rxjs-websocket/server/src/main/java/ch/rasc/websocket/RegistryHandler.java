package ch.rasc.websocket;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Async;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;


public class RegistryHandler extends TextWebSocketHandler {

  private final Map<String, Set<WebSocketSession>> topicSessions = new ConcurrentHashMap<>();

  private final ObjectMapper om;

  public RegistryHandler() {
    this.om = new ObjectMapper();
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    System.out.println("Connection established: " + session.getId());
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
      throws Exception {
    System.out.println("Connection closed: " + session.getId());
    this.topicSessions.computeIfPresent("temp",
        (_, set) -> set.remove(session) && set.isEmpty() ? null : set);
    this.topicSessions.computeIfPresent("hum",
        (_, set) -> set.remove(session) && set.isEmpty() ? null : set);
  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message)
      throws Exception {
    if ("\"ping\"".equals(message.getPayload())) {
      session.sendMessage(new TextMessage("\"pong\""));
    }
    else if ("\"subscribe-temp\"".equals(message.getPayload())) {
      this.topicSessions.computeIfAbsent("temp", _ -> ConcurrentHashMap.newKeySet())
          .add(session);
    }
    else if ("\"subscribe-hum\"".equals(message.getPayload())) {
      this.topicSessions.computeIfAbsent("hum", _ -> ConcurrentHashMap.newKeySet())
          .add(session);
    }
    else if ("\"unsubscribe-temp\"".equals(message.getPayload())) {
      this.topicSessions.computeIfPresent("temp",
          (_, set) -> set.remove(session) && set.isEmpty() ? null : set);
    }
    else if ("\"unsubscribe-hum\"".equals(message.getPayload())) {
      this.topicSessions.computeIfPresent("hum",
          (_, set) -> set.remove(session) && set.isEmpty() ? null : set);
    }
  }

  @Async
  public void sendTo(String topic, Object sensorData) {

    if (this.topicSessions.isEmpty()) {
      return;
    }

    Set<WebSocketSession> listeners = this.topicSessions.get(topic);
    if (listeners == null || listeners.isEmpty()) {
      return;
    }

    String payload = null;

    try {
      payload = this.om.writeValueAsString(sensorData);
    }
    catch (JacksonException e) {
      e.printStackTrace();
      return;
    }

    TextMessage textMessage = new TextMessage(payload);

    Set<WebSocketSession> errors = new HashSet<>();
    for (WebSocketSession session : listeners) {
      if (session.isOpen()) {
        try {
          session.sendMessage(textMessage);
        }
        catch (IOException e) {
          errors.add(session);
        }
      }
      else {
        errors.add(session);
      }
    }
    listeners.removeAll(errors);
  }

}