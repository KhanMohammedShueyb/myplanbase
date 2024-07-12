@extends("contractor.admin.layouts.default")

@section('content')
<div class="main-content container">
    <div class="row mt-6">
        <div class="col-lg-12">
            <!--begin::Card-->
            <div class="card card-custom gutter-b example example-compact">
                <div class="card-header">
                    <h3 class="card-title">Add Product Group</h3>
                </div>
                <!--begin::Form-->
                <form action="{{ route('contractor.admin.productgroups.update', ['productgroup' => $productgroup->id, 'subdomain' => $subdomain]) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method("PUT")

                    @if ( session()->has('error') )
                    <div>{{ session()->get('error') }}</div>
                    @endif

                    <div class="card-body">
                        @include('contractor.admin.productgroup.form', ['productgroup' => $productgroup, 'image_cnt' => count($productgroup->images)])
                        <div class="d-flex justify-content-end mt-10">
                            <a href="{{ route('contractor.admin.productgroups.list', ['subdomain' => $subdomain]) }}" class="btn btn-primary font-weight-bolder mr-5"><i class="fa fa-arrow-left"></i>Back</a>
                            <button type="submit" class="btn btn-primary">Update Product Group</button>
                        </div>
                    </div>
                </form>
                <!--end::Form-->
            </div>
            <!--end::Card-->
        </div>
    </div>
</div>
@endsection