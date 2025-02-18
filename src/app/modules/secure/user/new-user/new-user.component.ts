import { Component } from '@angular/core';
import { User } from '../../../../store/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
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
    }
  }

  onCancel(): void {
    this.userForm.reset();
  }
}
