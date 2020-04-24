package ch.rasc.chat;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.LongAdder;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.Translate.TranslateOption;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;

public class TranslateService {

	private final AppConfig appConfig;

	private final Translate translate;

	private final LongAdder noOfTranslatedCharacters;

	private MessageDigest messageDigest;

	private final Cache<String, String> translatedTexts = Caffeine.newBuilder()
			.expireAfterWrite(7, TimeUnit.DAYS).maximumSize(100_000).build();

	public TranslateService(AppConfig appConfig) throws IOException {

		try {
			this.messageDigest = MessageDigest.getInstance("MD5");
		}
		catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		this.appConfig = appConfig;

		if (appConfig.getCredentialsPath() != null) {
			try (InputStream is = Files
					.newInputStream(Paths.get(appConfig.getCredentialsPath()))) {
				ServiceAccountCredentials credentials = ServiceAccountCredentials
						.fromStream(is);

				this.translate = TranslateOptions.newBuilder().setCredentials(credentials)
						.build().getService();
			}
		}
		else {
			this.translate = null;
		}

		this.noOfTranslatedCharacters = new LongAdder();
	}

	public String translate(String text, String sourceLanguage, String targetLanguage) {
		if (text == null || sourceLanguage == null || targetLanguage == null
				|| sourceLanguage.equals(targetLanguage)) {
			return text;
		}

		byte[] thedigest = this.messageDigest
				.digest(text.getBytes(StandardCharsets.UTF_8));
		String key = sourceLanguage + "-" + targetLanguage + "-"
				+ Base64.getEncoder().encodeToString(thedigest);

		return this.translatedTexts.get(key, k -> {
			this.noOfTranslatedCharacters.add(text.length());
			if (this.translate != null && this.noOfTranslatedCharacters
					.sum() < this.appConfig.getLimitTranslationCharacters()) {
				Translation translation = this.translate.translate(text,
						TranslateOption.sourceLanguage(sourceLanguage),
						TranslateOption.targetLanguage(targetLanguage),
						TranslateOption.format("text"));

				return translation.getTranslatedText();
			}
			return text;
		});
	}

}
