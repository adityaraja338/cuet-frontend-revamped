import { Component, OnInit } from '@angular/core';
import { AdminHttpService } from '../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss',
})
export class AdminsComponent implements OnInit {
  admins: any = [];
  adminPageIndex: number = 1;
  adminPageSize: number = 30;
  adminTotalCount: number = 0;
  adminSearch: string = '';
  adminRoleSearch: any;
  isCreateEditAdminModal: boolean = false;
  isEditAdmin: boolean = false;
  adminForm: FormGroup;
  passwordVisible: boolean = false;
  isResetPasswordModal: boolean = false;
  resetPasswordForm: FormGroup;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  roles: any = [];
  rolePageIndex: number = 1;
  rolePageSize: number = 10;
  roleTotalCount: number = 0;
  roleSearch: string = '';
  isCreateEditRoleModal: boolean = false;
  isEditRole: boolean = false;
  roleForm: FormGroup;

  permissions: any = [];
  permissionPageIndex: number = 1;
  permissionPageSize: number = 10;
  permissionTotalCount: number = 0;
  permissionSearch: string = '';
  isCreateEditPermissionModal: boolean = false;
  isEditPermission: boolean = false;
  isEditPermissionRouteModal: boolean = false;
  permissionForm: FormGroup;
  permissionRouteForm: FormGroup;

  isDeleteModal = false;
  deleteMode = '';
  deleteId: any;

  features: any[] = [];
  isEditFeaturePriceModal = false;
  currentFeature: any;
  featurePriceInput: string = '';
  isPriceInputTouched = false;

  isUpdateImageModal = false;
  imageUrl: string = '';

  constructor(
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    private readonly fb: FormBuilder,
    protected readonly globalService: GlobalService,
  ) {
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          ),
        ],
      ],
      confirmNewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          ),
        ],
      ],
    });

    this.adminForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      name: [null, [Validators.required, Validators.maxLength(40)]],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          ),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      superAdmin: [false, [Validators.required]],
      roleId: [null],
    });

    this.roleForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      name: [null, [Validators.required, Validators.maxLength(40)]],
      permissions: [[], [Validators.required]],
    });

    this.permissionForm = this.fb.group({
      id: [{ value: null, disabled: true }],
      name: [null, [Validators.required, Validators.maxLength(40)]],
      slug: ['', [Validators.required]],
      route: [null, [Validators.required]],
      method: [null, [Validators.required]],
    });

    this.permissionRouteForm = this.fb.group({
      id: [{ value: null, disabled: true }, [Validators.required]],
      name: [{ value: null, disabled: true }, [Validators.required]],
      route: [null, [Validators.required]],
      method: [null, [Validators.required]],
    });

    this.adminForm
      ?.get('superAdmin')
      ?.valueChanges?.subscribe((value: boolean) => {
        if (this.adminForm?.get('superAdmin')?.value) {
          this.adminForm?.get('roleId')?.clearValidators();
          this.adminForm?.updateValueAndValidity();
        } else {
          this.adminForm?.get('roleId')?.setValidators([Validators.required]);
          this.adminForm?.updateValueAndValidity();
        }
      });
  }

  ngOnInit() {
    this.globalService?.data$.subscribe({
      next: (data: any) => {
        if (data?.permissions?.get_admins) this.getAdmins();
        if (data?.permissions?.get_roles) this.getRoles();
        if (data?.permissions?.get_permissions) this.getPermissions();
        this.getFeatures();
      },
    });
  }

  onResetPassword() {
    if (
      this.resetPasswordForm?.get('newPassword')?.value !==
      this.resetPasswordForm?.get('confirmNewPassword')?.value
    ) {
      this.message.error('Error! Passwords do not match!');
      return;
    }

    const data: any = {};
    data.oldPassword = this.resetPasswordForm?.get('oldPassword')?.value;
    data.newPassword = this.resetPasswordForm?.get('newPassword')?.value;

    this.http.putResetPassword(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Password updated!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getAdmins(event?: any) {
    const data: any = {
      page: this.adminPageIndex,
      limit: this.adminPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
      this.adminPageIndex = event.pageIndex;
      this.adminPageSize = event.pageSize;
    }

    if (this.adminSearch) {
      data['search'] = this.adminSearch;
    }

    if (this.adminRoleSearch) {
      data['roleIds'] = this.adminRoleSearch;
    }

    this.http.getAdmins(data).subscribe({
      next: (res: any) => {
        this.admins = res?.data?.admins;
        this.adminTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickAdmin(event: any, admin: any) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.onOpenAdminModal(admin);
  }

  onOpenAdminModal(admin?: any) {
    if (admin) {
      this.adminForm?.get('id')?.setValidators([Validators.required]);
      this.adminForm?.get('password')?.clearValidators();
      this.adminForm
        ?.get('password')
        ?.setValidators([
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          ),
        ]);
      this.adminForm.updateValueAndValidity();
      this.adminForm.reset();

      this.adminForm?.get('id')?.patchValue(admin?.id);
      this.adminForm?.get('name')?.patchValue(admin?.name);
      this.adminForm?.get('email')?.patchValue(admin?.email);
      this.adminForm?.get('superAdmin')?.patchValue(admin?.superAdmin);
      this.adminForm?.get('roleId')?.patchValue(admin?.role?.id);
      this.isEditAdmin = true;
    } else {
      this.adminForm?.get('id')?.clearValidators();
      this.adminForm?.get('password')?.clearValidators();
      this.adminForm
        ?.get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          ),
        ]);
      this.adminForm.updateValueAndValidity();
      this.adminForm.reset();
      this.isEditAdmin = false;
    }
    this.isCreateEditAdminModal = true;
  }

  onCreateEditAdmin() {
    if (this.adminForm.invalid) {
      Object.keys(this.adminForm.controls).forEach((field: string) => {
        const control = this.adminForm.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {};
    data.name = this.adminForm?.get('name')?.value;
    data.email = this.adminForm?.get('email')?.value;
    data.password = this.adminForm?.get('password')?.value;
    data.superAdmin = this.adminForm?.get('superAdmin')?.value;
    data.roleId = this.adminForm?.get('roleId')?.value;

    if (this.isEditAdmin) {
      data.id = this.adminForm?.get('id')?.value;
      this.http.putEditAdmin(data).subscribe({
        next: (res: any) => {
          this.getAdmins();
          this.message.success('Successful! Admin edited!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateAdmin(data).subscribe({
        next: (res: any) => {
          this.getAdmins();
          this.message.success('Successful! Admin created!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onDeleteAdmin() {
    const data: any = {};
    data.adminId = this.deleteId;

    this.http.deleteAdmin(data).subscribe({
      next: (res: any) => {
        this.getAdmins();
        this.message.success('Successful! Admin deleted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getRoles(event?: any) {
    const data: any = {
      page: this.rolePageIndex,
      limit: this.rolePageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
      this.rolePageIndex = event.pageIndex;
      this.rolePageSize = event.pageSize;
    }

    if (this.roleSearch) {
      data['search'] = this.roleSearch;
    }

    this.http.getRoles(data).subscribe({
      next: (res: any) => {
        this.roles = res?.data?.roles;
        this.roles?.forEach((role: any) => {
          role.permissions = role?.rolePermissions?.map(
            (permission: any) => permission?.permissionSlug,
          );
        });
        // console.log(this.roles);
        this.roleTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickRole(event: any, role: any) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.onOpenRolesModal(role);
  }

  onOpenRolesModal(role?: any) {
    if (role) {
      this.roleForm?.get('id')?.setValidators([Validators.required]);
      this.adminForm.updateValueAndValidity();
      this.roleForm.reset();

      this.roleForm?.get('id')?.patchValue(role?.id);
      this.roleForm?.get('name')?.patchValue(role?.name);
      this.roleForm?.get('permissions')?.patchValue(role?.permissions);
      this.isEditRole = true;
    } else {
      this.roleForm?.get('id')?.clearValidators();
      this.roleForm.updateValueAndValidity();
      this.roleForm.reset();

      this.isEditRole = false;
    }
    this.isCreateEditRoleModal = true;
  }

  onCreateEditRole() {
    if (this.roleForm.invalid) {
      Object.keys(this.roleForm.controls).forEach((field: string) => {
        const control = this.roleForm.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {};
    data.name = this.roleForm?.get('name')?.value;
    data.slugs = this.roleForm?.get('permissions')?.value;

    if (this.isEditRole) {
      data.id = this.roleForm?.get('id')?.value;
      this.http.putEditRole(data).subscribe({
        next: (res: any) => {
          this.getRoles();
          this.message.success('Successful! Role edited!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateRole(data).subscribe({
        next: (res: any) => {
          this.getRoles();
          this.message.success('Successful! Role created!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onDeleteRole() {
    const data: any = {};
    data.roleId = this.deleteId;

    this.http.deleteRole(data).subscribe({
      next: (res: any) => {
        this.getRoles();
        this.message.success('Successful! Role deleted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getPermissions(event?: any) {
    const data: any = {
      page: this.permissionPageIndex,
      limit: this.permissionPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
      this.permissionPageIndex = event.pageIndex;
      this.permissionPageSize = event.pageSize;
    }

    if (this.permissionSearch) {
      data['search'] = this.permissionSearch;
    }

    this.http.getPermissions(data).subscribe({
      next: (res: any) => {
        this.permissions = res?.data?.permissions;
        this.permissionTotalCount = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onClickPermission(event: any, permission: any) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.onOpenPermissionsModal(permission);
  }

  onOpenPermissionsModal(permission?: any) {
    if (permission) {
      this.permissionForm?.get('id')?.setValidators([Validators.required]);
      this.permissionForm.updateValueAndValidity();
      this.permissionForm.reset();

      this.permissionForm?.get('id')?.patchValue(permission?.id);
      this.permissionForm?.get('name')?.patchValue(permission?.name);
      this.permissionForm?.get('slug')?.patchValue(permission?.slug);
      this.permissionForm?.get('route')?.patchValue(permission?.route);
      this.permissionForm?.get('route')?.disable();
      this.permissionForm?.get('method')?.patchValue(permission?.method);
      this.permissionForm?.get('method')?.disable();
      this.isEditPermission = true;
    } else {
      this.permissionForm?.get('id')?.clearValidators();
      this.permissionForm?.get('route')?.enable();
      this.permissionForm?.get('method')?.enable();
      this.permissionForm.updateValueAndValidity();
      this.permissionForm.reset();

      this.isEditPermission = false;
    }
    this.isCreateEditPermissionModal = true;
  }

  onCreateEditPermission() {
    if (this.permissionForm.invalid) {
      Object.keys(this.permissionForm.controls).forEach((field: string) => {
        const control = this.permissionForm.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {};
    data.name = this.permissionForm?.get('name')?.value;
    data.slug = this.permissionForm?.get('slug')?.value;

    if (this.isEditPermission) {
      data.id = this.permissionForm?.get('id')?.value;
      this.http.putEditPermission(data).subscribe({
        next: (res: any) => {
          this.getPermissions();
          this.message.success('Successful! Permission edited!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      data.route = this.permissionForm?.get('route')?.value;
      data.method = this.permissionForm?.get('method')?.value;
      this.http.postCreatePermission(data).subscribe({
        next: (res: any) => {
          this.getPermissions();
          this.message.success('Successful! Permission created!');
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onOpenPermissionRouteModal(permission?: any) {
    if (!permission) {
      this.message.error('Error! Permission not selected!');
    }

    this.permissionRouteForm.updateValueAndValidity();
    this.permissionRouteForm.reset();
    this.permissionRouteForm?.get('id')?.patchValue(permission?.id);
    this.permissionRouteForm?.get('name')?.patchValue(permission?.name);
    this.permissionRouteForm?.get('route')?.patchValue(permission?.route);
    this.permissionRouteForm?.get('method')?.patchValue(permission?.method);
    this.isEditPermissionRouteModal = true;
  }

  onEditRoutePermission() {
    if (this.permissionRouteForm.invalid) {
      Object.keys(this.permissionRouteForm.controls).forEach(
        (field: string) => {
          const control = this.permissionRouteForm.get(field);
          control?.markAsDirty({ onlySelf: true });
          control?.markAsTouched({ onlySelf: true });
          control?.updateValueAndValidity({ onlySelf: true });
        },
      );
      return;
    }

    const data: any = {};
    data.id = this.permissionRouteForm?.get('id')?.value;
    data.route = this.permissionRouteForm?.get('route')?.value;
    data.method = this.permissionRouteForm?.get('method')?.value;
    this.http.putEditPermissionRoute(data).subscribe({
      next: (res: any) => {
        this.getPermissions();
        this.message.success('Successful! Permission route edited!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onDeletePermission() {
    const data: any = {};
    data.permissionId = this.deleteId;

    this.http.deletePermission(data).subscribe({
      next: (res: any) => {
        this.getPermissions();
        this.getRoles();
        this.message.success('Successful! Permission deleted!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onDelete() {
    if (this.deleteMode === 'admin') {
      this.onDeleteAdmin();
    } else if (this.deleteMode === 'role') {
      this.onDeleteRole();
    } else if (this.deleteMode === 'permission') {
      this.onDeletePermission();
    } else {
      this.message.error('Error! Invalid mode!');
      this.onModalClose();
    }
  }

  onOpenUpdateProfileImageModal() {
    this.imageUrl = this.globalService?.userDetails?.imageUrl;
    this.isUpdateImageModal = true;
  }

  onUpdateImage() {
    const data: any = {
      imageUrl: this.imageUrl,
    };

    this.http.putChangeImage(data).subscribe({
      next: (res: any) => {
        this.globalService?.getMe();
        this.message.success('Successful! Image Updated!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getFeatures() {
    this.http.getFeatures().subscribe({
      next: (res: any) => {
        this.features = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(
          error?.error?.message ?? 'Oops! Something went wrong!',
        );
      },
    });
  }

  onClickFeatureEdit(feature: any) {
    this.currentFeature = feature;
    this.featurePriceInput = feature?.price ?? 0;
    this.isEditFeaturePriceModal = true;
    this.isPriceInputTouched = false;
  }

  onSaveFeaturePrice() {
    if (this.featurePriceInput?.length === 0 || +this.featurePriceInput < 0) {
      this.message.error('Please enter a valid price!');
      return;
    }

    const data: any = {};
    data.id = this.currentFeature?.id;
    data.price = +this.featurePriceInput;

    this.http.updateFeaturePrice(data).subscribe({
      next: (res: any) => {
        this.getFeatures();
        this.message.success('Saved successfully!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(
          error?.error?.message ?? 'Oops! Something went wrong!',
        );
      },
    });
  }

  isFeatureDeleteModal = false;
  onFeatureDeleteModal(feature: any) {
    this.currentFeature = feature;
    this.isFeatureDeleteModal = true;
  }

  onDeleteFeature() {
    this.http.deleteFeature({ featureId: this.currentFeature?.id }).subscribe({
      next: (res: any) => {
        this.getFeatures();
        this.message.success('Feature deleted successfully!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(
          error?.error?.message ?? 'Failed to delete feature!',
        );
      },
    });
  }

  isCreateFeatureModal = false;
  featureForm: FormGroup = this.fb.group({
    name: [undefined, [Validators.required]],
    price: [undefined, [Validators.required]],
  });
  onOpenCreateFeatureModal() {
    this.featureForm.reset();
    this.isCreateFeatureModal = true;
  }

  onCreateFeature() {
    if (this.featureForm.invalid) {
      Object.keys(this.featureForm.controls).forEach((field: string) => {
        const control = this.featureForm.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const data: any = {
      name: this.featureForm?.get('name')?.value,
      price: this.featureForm?.get('price')?.value,
    };

    this.http.createFeature(data).subscribe({
      next: (res: any) => {
        this.getFeatures();
        this.message.success('Successful! Feature created!');
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.isCreateEditAdminModal = false;
    this.isCreateEditRoleModal = false;
    this.isEditAdmin = false;
    this.isEditRole = false;
    this.isDeleteModal = false;
    this.deleteMode = '';
    this.deleteId = undefined;
    this.isResetPasswordModal = false;
    this.passwordVisible = false;
    this.newPasswordVisible = false;
    this.confirmPasswordVisible = false;
    this.isCreateEditPermissionModal = false;
    this.isEditPermissionRouteModal = false;
    this.isUpdateImageModal = false;
    this.imageUrl = '';
    this.resetPasswordForm.reset();
    this.adminForm.reset();
    this.roleForm.reset();
    this.permissionForm.reset();
    this.permissionRouteForm.reset();
    this.currentFeature = undefined;
    this.isEditFeaturePriceModal = false;
    this.isPriceInputTouched = false;
    this.featurePriceInput = '';
    this.isFeatureDeleteModal = false;
    this.isCreateFeatureModal = false;
  }

  protected readonly isNaN = isNaN;
}
