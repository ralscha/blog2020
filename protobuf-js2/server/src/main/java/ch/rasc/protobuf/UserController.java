package ch.rasc.protobuf;

import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ch.rasc.protobuf.User.UserRequest;
import ch.rasc.protobuf.User.UserResponse;
import ch.rasc.protobuf.User.UserResponse.Status;

@RestController
@CrossOrigin
public class UserController {

  @PostMapping("/register-user")
  public UserResponse registerUser(@RequestBody UserRequest userRequest) {
    System.out.println(userRequest);

    Status status = Status.OK;
    if (userRequest.getAge() < 18) {
      status = Status.NOT_OK;
    }

    return UserResponse.newBuilder().setId(UUID.randomUUID().toString()).setStatus(status)
        .build();
  }

}
