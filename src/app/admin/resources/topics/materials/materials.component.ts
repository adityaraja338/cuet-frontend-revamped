import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminHttpService } from '../../../../shared/services/admin-http.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent implements OnInit {
  subjectName: string = 'Subject';
  topicName: string = 'Topic';

  topicId: any;

  materials: any;
  searchMaterial: string = '';
  isCreateEditMaterialModal = false;
  isEditModal = false;
  addEditMaterialForm: FormGroup;

  topicTests: any;
  searchTest: string = '';
  topicPageIndex: any = 1;
  topicPageSize: any = 30;
  totalTopicTestCount: any;
  isTopicLoading = false;

  isDeleteModal = false;
  modalType: string = '';
  deleteTestId: any;
  deleteMaterialId: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: AdminHttpService,
    private readonly message: NzMessageService,
    private readonly formBuilder: FormBuilder,
    protected readonly globalService: GlobalService,
  ) {
    this.addEditMaterialForm = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      name: ['', [Validators.required]],
      isFree: [false, [Validators.required]],
      url: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
          ),
        ],
      ],
      topicId: [{ value: null, disabled: true }, [Validators.required]],
    });
  }

  ngOnInit() {
    this.topicId = +this.route.snapshot.params['topicId'];

    if (isNaN(this.topicId)) {
      this.message.error('Error! Invalid topic selected!');
      this.router.navigate(['/', 'admin', 'resources']);
      return;
    }

    this.addEditMaterialForm?.get('topicId')?.patchValue(this.topicId);
    this.getMaterials();
    this.getTopicTests();
  }

  getMaterials() {
    const data: any = {};

    data.topicId = this.topicId;
    if (this.searchMaterial) data.search = this.searchMaterial;

    this.http.getMaterials(data).subscribe({
      next: (res: any) => {
        this.materials = res?.data?.materials;
        this.subjectName = res?.data?.subjectName;
        this.topicName = res?.data?.topicName;
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  getTopicTests(event?: any) {
    this.isTopicLoading = true;

    const data: any = {
      page: this.topicPageIndex,
      limit: this.topicPageSize,
    };

    if (event) {
      data['page'] = event?.pageIndex;
      data['limit'] = event?.pageSize;
      this.topicPageIndex = event?.pageIndex;
      this.topicPageSize = event?.pageSize;
    }

    if (this.searchTest) {
      data['search'] = this.searchTest;
    }

    this.http.getTopicTests(data).subscribe({
      next: (res: any) => {
        this.isTopicLoading = false;
        this.topicTests = res?.data?.tests;
        this.totalTopicTestCount = res?.data?.total;
      },
      error: (error: any) => {
        this.isTopicLoading = false;
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onChangeType(testId: number, testType: string, mode?: string) {
    const data: any = {};
    data['testId'] = testId;
    data['testType'] = testType;
    mode ? (data['mode'] = mode) : null;

    this.http.putChangeTestType(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test type updated!');
        this.getTopicTests();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onDeleteTest() {
    const data: any = {};
    data['testId'] = this.deleteTestId;
    data['testType'] = 'topic';

    this.http.deleteTest(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Test deleted!');
        this.getTopicTests();
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onOpenMaterialForm(material?: any) {
    this.addEditMaterialForm.reset();
    if (material) {
      this.isEditModal = true;
      this.addEditMaterialForm?.get('id')?.setValidators([Validators.required]);
      this.addEditMaterialForm?.updateValueAndValidity();
      this.addEditMaterialForm?.get('id')?.patchValue(material?.id);
      this.addEditMaterialForm?.get('name')?.patchValue(material?.name);
      this.addEditMaterialForm?.get('url')?.patchValue(material?.url);
      this.addEditMaterialForm?.get('isFree')?.patchValue(material?.isFree);
    } else {
      this.isEditModal = false;
      this.addEditMaterialForm?.get('id')?.clearValidators();
      this.addEditMaterialForm?.updateValueAndValidity();
      this.addEditMaterialForm?.get('isFree')?.patchValue(false);
    }
    this.addEditMaterialForm?.get('topicId')?.patchValue(this.topicId);
    this.isCreateEditMaterialModal = true;
  }

  onCreateSaveMaterial() {
    if (this.addEditMaterialForm.invalid) {
      this.message.error('Marked fields are mandatory!');
      Object.keys(this.addEditMaterialForm?.controls)?.forEach((field) => {
        const control = this.addEditMaterialForm?.get(field);
        control?.markAsDirty({ onlySelf: true });
        control?.markAsTouched({ onlySelf: true });
        control?.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const payload: any = {};
    this.isEditModal
      ? (payload.materialId = this.addEditMaterialForm?.get('id')?.value)
      : null;
    payload.name = this.addEditMaterialForm?.get('name')?.value;
    payload.url = this.addEditMaterialForm?.get('url')?.value;
    payload.isFree = this.addEditMaterialForm?.get('isFree')?.value;
    payload.topicId = this.addEditMaterialForm?.get('topicId')?.value;

    if (this.isEditModal) {
      this.http.putEditMaterial(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Material updated!');
          this.getMaterials();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    } else {
      this.http.postCreateMaterial(payload).subscribe({
        next: (res: any) => {
          this.message.success('Successful! Material created!');
          this.getMaterials();
          this.onModalClose();
        },
        error: (error: any) => {
          console.log(error);
          this.message.error(error?.error?.message);
        },
      });
    }
  }

  onOpenDeleteModal(id: any, type: string) {
    if (type === 'test') {
      this.deleteTestId = id;
    } else if (type === 'material') {
      this.deleteMaterialId = id;
    } else {
      this.message.error('Error! Invalid selection!');
      return;
    }
    this.isDeleteModal = true;
  }

  onDeleteMaterial() {
    const data: any = {
      materialId: this.deleteMaterialId,
    };

    this.http.deleteMaterial(data).subscribe({
      next: (res: any) => {
        this.message.success('Successful! Material deleted!');
        this.getMaterials();
        this.onModalClose();
      },
      error: (error: any) => {
        console.log(error);
        this.message.error(error?.error?.message);
      },
    });
  }

  onModalClose() {
    this.isDeleteModal = false;
    this.isCreateEditMaterialModal = false;
    this.deleteMaterialId = undefined;
    this.deleteTestId = undefined;
    this.modalType = '';
  }

  onClickTest(event: any, testType: string, testId: number) {
    const excludedSection = (event.target as HTMLElement).closest(
      '.dropdown-container',
    );

    if (excludedSection) {
      // Do nothing if the click was on the excluded section
      return;
    }

    this.router.navigate(['/', 'admin', 'tests', testType, testId]);
  }

  protected readonly Math = Math;
}
