import { Component } from '@angular/core';
import { User } from '../../../../store/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from '../../../../service/user/user-store.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  user!: User;
  total!: number;
  userForm: FormGroup;
  isEdit = false;

  constructor(private formBuilder: FormBuilder, private userStore: UserStoreService,) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      role: ['user'],
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.isEdit = true;
      this.userForm.patchValue(this.user);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.isEdit ? 'Update User' : 'Add User', this.userForm.value);
      let payload: User = {
        ...this.userForm?.value
      }
      this.userStore.addUser(payload)
    }
  }

  onCancel(): void {
    this.userForm.reset();
  }
}
