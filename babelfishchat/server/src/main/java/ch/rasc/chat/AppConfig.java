package ch.rasc.chat;

public class AppConfig {
	private String credentialsPath;

	private long limitTranslationCharacters;

	public String getCredentialsPath() {
		return this.credentialsPath;
	}

	public void setCredentialsPath(String credentialsPath) {
		this.credentialsPath = credentialsPath;
	}

	public long getLimitTranslationCharacters() {
		return this.limitTranslationCharacters;
	}

	public void setLimitTranslationCharacters(long limitTranslationCharacters) {
		this.limitTranslationCharacters = limitTranslationCharacters;
	}

}
