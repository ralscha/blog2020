package ch.rasc.chat;

import java.util.Objects;

public class User {
  private final String username;

  private final byte[] publicKey;

  public User(String username, byte[] publicKey) {
    this.username = username;
    this.publicKey = publicKey;
  }

  public String getUsername() {
    return this.username;
  }

  public byte[] getPublicKey() {
    return this.publicKey;
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.username);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (!(obj instanceof User other)) {
      return false;
    }
    return Objects.equals(this.username, other.username);
  }

}
