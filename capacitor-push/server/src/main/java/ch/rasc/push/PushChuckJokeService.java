package ch.rasc.push;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import org.unbescape.html.HtmlEscape;

import ch.rasc.push.ChuckNorrisJokeService.Joke;

@Service
public class PushChuckJokeService {

  private final ChuckNorrisJokeService chuckNorrisJokeService;

  private final FcmClient fcmClient;

  private int id = 0;

  public PushChuckJokeService(FcmClient fcmClient) {
    this.fcmClient = fcmClient;
    WebClient client = WebClient.builder().baseUrl("https://api.chucknorris.io").build();
    HttpServiceProxyFactory factory = HttpServiceProxyFactory
        .builderFor(WebClientAdapter.create(client)).build();
    this.chuckNorrisJokeService = factory.createClient(ChuckNorrisJokeService.class);
  }

  @Scheduled(fixedDelay = 30_000)
  public void sendChuckQuotes() {
    Joke joke = this.chuckNorrisJokeService.getRandomJoke();
    sendPushMessage(HtmlEscape.unescapeHtml(joke.value()));
  }

  void sendPushMessage(String joke) {
    Map<String, String> data = new HashMap<>();
    data.put("id", String.valueOf(++this.id));
    data.put("text", joke);

    // Send a message
    System.out.println("Sending chuck joke...");
    try {
      this.fcmClient.sendJoke(data);
    }
    catch (InterruptedException | ExecutionException e) {
      Application.logger.error("send joke", e);
    }
  }

}
