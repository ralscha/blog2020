package ch.rasc.chat;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.config.EnableWebFlux;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;

import io.cettia.DefaultServer;
import io.cettia.Server;
import io.cettia.ServerSocket;
import io.cettia.ServerSocket.Reply;
import io.cettia.ServerSocketPredicates;
import io.cettia.asity.action.Action;
import io.cettia.asity.bridge.spring.webflux5.AsityHandlerFunction;
import io.cettia.asity.bridge.spring.webflux5.AsityWebSocketHandler;
import io.cettia.transport.http.HttpTransportServer;
import io.cettia.transport.websocket.WebSocketTransportServer;

@SpringBootApplication
@EnableWebFlux
public class Application {

	private final Map<String, Set<String>> roomUsers = new ConcurrentHashMap<>();

	@Bean
	public Server defaultServer() {
		Server server = new DefaultServer();

		server.onsocket(socket -> {
			socket.on("join", handleJoin(server, socket));
			socket.on("message", handleChatMessage(server, socket));
			socket.on("leave", handleLeave(server, socket));

			disconnectHandling(server, socket);
		});

		return server;
	}

	private void disconnectHandling(Server server, ServerSocket socket) {
		// Disconnect Handling
		// https://cettia.io/guides/cettia-tutorial/#disconnection-handling
		Queue<Object[]> queue = new ConcurrentLinkedQueue<>();
		socket.oncache(args -> queue.offer(args));
		socket.onopen(v -> {
			while (!queue.isEmpty()) {
				Object[] args = queue.poll();
				socket.send((String) args[0], args[1], (Action<?>) args[2],
						(Action<?>) args[3]);
			}
		});

		socket.ondelete(msg -> {
			String username = socket.get("username");
			String room = socket.get("room");
			if (username != null && room != null) {
				removeUser(server, socket, username, room);
			}
		});
	}

	private Action<Reply<Void>> handleLeave(Server server, ServerSocket socket) {
		return reply -> {
			String username = socket.get("username");
			String room = socket.get("room");
			removeUser(server, socket, username, room);
			reply.resolve();
		};
	}

	private void removeUser(Server server, ServerSocket socket, String username,
			String room) {

		this.roomUsers.computeIfPresent(room,
				(k, set) -> set.remove(username) && set.isEmpty() ? null : set);

		// broadcast to other room users that a user left
		server.find(ServerSocketPredicates.attr("room", room)
				.and(ServerSocketPredicates.id(socket).negate())).send("leave", username);
	}

	private static Action<Map<String, Object>> handleChatMessage(Server server,
			ServerSocket socket) {
		return message -> {
			String username = socket.get("username");
			String room = socket.get("room");

			String msg = (String) message.get("msg");
			int ts = (int) message.get("ts");

			server.find(ServerSocketPredicates.attr("room", room)
					.and(ServerSocketPredicates.id(socket).negate()))
					.send("message", Map.of("user", username, "msg", msg, "ts", ts));
		};
	}

	private Action<Reply<Map<String, Object>>> handleJoin(Server server,
			ServerSocket socket) {
		return reply -> {
			String username = (String) reply.data().get("username");
			String room = (String) reply.data().get("room");

			Set<String> users = this.roomUsers.get(room);
			if (users != null && users.contains(username)) {
				reply.resolve(false);
				return;
			}

			socket.set("username", username);
			socket.set("room", room);

			this.roomUsers.computeIfAbsent(room, k -> ConcurrentHashMap.newKeySet())
					.add(username);

			// send list of room users to new user
			socket.send("users", this.roomUsers.get(room));

			// broadcast to other room users that new user joined
			server.find(ServerSocketPredicates.attr("room", room)
					.and(ServerSocketPredicates.id(socket).negate()))
					.send("join", username);

			reply.resolve(true);
		};
	}

	@Bean
	public RouterFunction<ServerResponse> httpMapping(Server defaultServer) {
		HttpTransportServer httpTransportServer = new HttpTransportServer()
				.ontransport(defaultServer);
		AsityHandlerFunction asityHandlerFunction = new AsityHandlerFunction()
				.onhttp(httpTransportServer);

		return RouterFunctions.route(RequestPredicates.path("/cettia")
				// Excludes WebSocket handshake requests
				.and(RequestPredicates.headers(headers -> !"websocket"
						.equalsIgnoreCase(headers.asHttpHeaders().getUpgrade()))),
				asityHandlerFunction);
	}

	@Bean
	public HandlerMapping wsMapping(Server defaultServer) {
		WebSocketTransportServer wsTransportServer = new WebSocketTransportServer()
				.ontransport(defaultServer);
		AsityWebSocketHandler asityWebSocketHandler = new AsityWebSocketHandler()
				.onwebsocket(wsTransportServer);
		Map<String, WebSocketHandler> map = new LinkedHashMap<>();
		map.put("/cettia", asityWebSocketHandler);

		SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
		mapping.setUrlMap(map);

		return mapping;
	}

	@Bean
	public WebSocketHandlerAdapter webSocketHandlerAdapter() {
		return new WebSocketHandlerAdapter();
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
