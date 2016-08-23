import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";

@Injectable()
export class AuthService {
  private loggedIn = false;

  constructor(private http: Http) {
    this.loggedIn = !!localStorage.getItem("auth_token");
  }

  public login(username, password) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(
      "http://192.168.1.100:8080/user/login",
      JSON.stringify({ username, password }),
      { headers }
      )
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          throw new Error("This request has failed " + res.status);
        } else {
          localStorage.setItem("auth_token", JSON.parse(JSON.stringify(res))._body);
          this.loggedIn = true;
          return res.status;
        }
      });
  }

  public sendToken(token) {
    // debugger;
    let userUrl = "http://localhost:8080/rest/user/users";
    let headers2 = new Headers({ "Authorization": "Bearer " + token });

    return this.http.get(userUrl, { headers: headers2 });
  }

  public logout() {
    localStorage.removeItem("auth_token");
    this.loggedIn = false;
  }

  public isLoggedIn() {
    return this.loggedIn;
  }
}
