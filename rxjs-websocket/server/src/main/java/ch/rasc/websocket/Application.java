package ch.rasc.websocket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableScheduling
@EnableAsync(proxyTargetClass = true)
@EnableWebSocket
public class Application implements WebSocketConfigurer {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public RegistryHandler registryHandler() {
    return new RegistryHandler();
  }

  @Bean
  public CalculatorHandler calculatorHandler() {
    return new CalculatorHandler();
  }

  @Bean
  public TaskScheduler taskScheduler() {
    ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
    scheduler.setPoolSize(1);
    scheduler.setThreadNamePrefix("scheduled-task-");
    scheduler.setDaemon(true);
    return scheduler;
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(registryHandler(), "/sensor")
        .setAllowedOrigins("http://localhost:1234");
    registry.addHandler(calculatorHandler(), "/calculator")
        .setAllowedOrigins("http://localhost:1234");
  }

}
