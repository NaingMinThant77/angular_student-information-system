import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import{ GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}

 // login method
 login(email : string, password : string) {
  this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
      localStorage.setItem('token','true');

      // if(res.user?.emailVerified == true) {
        // this.router.navigate(['dashboard']);
        this.router.navigate(['file-upload'])
      // } else {
      //   this.router.navigate(['/varify-email']);
      // }

  }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
  })
}

// register method
register(email : string, password : string) {
  this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
    alert('Registration Successful');
    this.router.navigate(['/login']);
    this.sendEmailforVarification(res.user);
  }, err => {
    alert(err.message);
    this.router.navigate(['/register']);
  })
}

  //email varification 
  sendEmailforVarification(user : any) {
    user.sendEmailforVarification().then((res : any) => {
      this.router.navigate(['/varify-email']);
    },  (err : any ) => {
      alert('Something went wrong. Not able to send mail to your email');
    })
  }

  // Sign out method
  logout() {
     this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }

  //forget Password method
  forgetPassword (email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/varify-email']);
    }, err => {
      alert('Something went wrong');
    })
  }

  //sign in with google
  GoogleSignIn () {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    }, err => {
      alert(err.message)
    })
  }
}
