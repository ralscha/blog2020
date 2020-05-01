package ch.rasc.hcaptcha;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
@RestController
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Value("${hCaptcha.secret.key}")
	private String hCaptchaSecretKey;

	private final HttpClient httpClient;

	private final ObjectMapper om = new ObjectMapper();

	Application() {
		this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5))
				.build();
	}

	@PostMapping("/signup")
	public boolean signup(
			@RequestParam(name = "username", required = true) String username,
			@RequestParam(name = "email", required = true) String email,
			@RequestParam("h-captcha-response") String captchaResponse)
			throws IOException, InterruptedException {
		if (StringUtils.hasText(captchaResponse)) {

			var sb = new StringBuilder();
			sb.append("response=");
			sb.append(captchaResponse);
			//sb.append("&secret=");
			//sb.append(this.hCaptchaSecretKey);

			HttpRequest request = HttpRequest.newBuilder()
					.uri(URI.create("https://hcaptcha.com/siteverify"))
					.header("Content-Type", "application/x-www-form-urlencoded")
					.timeout(Duration.ofSeconds(10))
					.POST(BodyPublishers.ofString(sb.toString())).build();

			HttpResponse<String> response = this.httpClient.send(request,
					BodyHandlers.ofString());

			System.out.println("http response status: " + response.statusCode());
			System.out.println("body: " + response.body());

			JsonNode hCaptchaResponseObject = this.om.readTree(response.body());
			boolean success = hCaptchaResponseObject.get("success").asBoolean();

			// timestamp of the captcha (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
			JsonNode jsonNode = hCaptchaResponseObject.get("challenge_ts");
			if (jsonNode != null) {
				String challengeTs = jsonNode.asText();
				System.out.println("challenge_ts=" + challengeTs);
			}

			// the hostname of the site where the captcha was solved
			jsonNode = hCaptchaResponseObject.get("hostname");
			if (jsonNode != null) {
				String hostname = jsonNode.asText();
				System.out.println("hostname=" + hostname);
			}

			// optional: whether the response will be credited
			jsonNode = hCaptchaResponseObject.get("credit");
			if (jsonNode != null) {
				boolean credit = jsonNode.asBoolean();
				System.out.println("credit=" + credit);
			}

			JsonNode errorCodesArray = hCaptchaResponseObject.get("error-codes");
			if (errorCodesArray != null) {
				System.out.println("error-codes");
				for (JsonNode errorCode : errorCodesArray) {
					System.out.println("  " + errorCode.asText());
				}
			}
			else {
				System.out.println("no errors");
			}

			return success;
		}

		return false;
	}

}
