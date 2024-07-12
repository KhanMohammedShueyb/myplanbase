$(document).ready(function (e) {
    let fetchedContacts = [];
    let isFetch = true;
    let isUploadCsv = false;
    let csvFileName = '';
    let reviewJobForm = $('#reviewJobForm');
    let note = '';


    setTimeout(function () {
        tabSelectionBySession();
    }, 1000);

    function tabSelectionBySession() {
        var activeTab = sessionStorage.getItem('activeTab-MM');
        if (activeTab == 'logsNavLink') {
            sessionStorage.setItem('activeTab-MM', 'logsNavLink');
            hideAndClearReviewJob();
            let pillsProfile = $("#pillsProfile");
            let pillsCreateJob = $("#pillsCreateJob");
            let pillsAllLogs = $("#pillsAllLogs");

            pillsProfile.addClass('active');
            pillsProfile.addClass('show');
            pillsCreateJob.removeClass('active');
            pillsCreateJob.removeClass('show');
            pillsAllLogs.removeClass('active');
            pillsAllLogs.removeClass('show');
            if (!$('#logsNavLink').hasClass('active')) {
                $('#logsNavLink').addClass('active');
                $('#createJobNavLink').removeClass('active');
                $('#allLogsNavLink').removeClass('active');
            }
        } else if (activeTab == 'allLogsNavLink') {
            hideAndClearReviewJob();
            let pillsAllLogs = $("#pillsAllLogs");
            let pillsProfile = $("#pillsProfile");
            let pillsCreateJob = $("#pillsCreateJob");

            pillsAllLogs.addClass('active');
            pillsAllLogs.addClass('show');
            pillsProfile.removeClass('active');
            pillsProfile.removeClass('show');
            pillsCreateJob.removeClass('active');
            pillsCreateJob.removeClass('show');
            if (!$('#allLogsNavLink').hasClass('active')) {
                $('#allLogsNavLink').addClass('active');
                $('#logsNavLink').removeClass('active');
                $('#createJobNavLink').removeClass('active');
            }
        }
    }




    $("#createJobNavLink").on("click", function (e) {
        sessionStorage.setItem('activeTab-MM', 'createJobNavLink');
        hideAndClearReviewJob();
        let pillsProfile = $("#pillsProfile");
        let pillsCreateJob = $("#pillsCreateJob");
        let pillsAllLogs = $("#pillsAllLogs");


        pillsCreateJob.addClass('active');
        pillsCreateJob.addClass('show');
        pillsProfile.removeClass('active');
        pillsProfile.removeClass('show');
        pillsAllLogs.removeClass('active');
        pillsAllLogs.removeClass('show');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active')
            $('#logsNavLink').removeClass('active');
            $('#allLogsNavLink').removeClass('active');
        }
    });

    $("#logsNavLink").on("click", function (e) {
        sessionStorage.setItem('activeTab-MM', 'logsNavLink');
        hideAndClearReviewJob();
        let pillsProfile = $("#pillsProfile");
        let pillsCreateJob = $("#pillsCreateJob");
        let pillsAllLogs = $("#pillsAllLogs");

        pillsProfile.addClass('active');
        pillsProfile.addClass('show');
        pillsCreateJob.removeClass('active');
        pillsCreateJob.removeClass('show');
        pillsAllLogs.removeClass('active');
        pillsAllLogs.removeClass('show');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $('#createJobNavLink').removeClass('active');
            $('#allLogsNavLink').removeClass('active');
        }
    });

    $("#allLogsNavLink").on("click", function (e) {
        sessionStorage.setItem('activeTab-MM', 'allLogsNavLink');
        hideAndClearReviewJob();
        let pillsAllLogs = $("#pillsAllLogs");
        let pillsProfile = $("#pillsProfile");
        let pillsCreateJob = $("#pillsCreateJob");

        pillsAllLogs.addClass('active');
        pillsAllLogs.addClass('show');
        pillsProfile.removeClass('active');
        pillsProfile.removeClass('show');
        pillsCreateJob.removeClass('active');
        pillsCreateJob.removeClass('show');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $('#logsNavLink').removeClass('active');
            $('#createJobNavLink').removeClass('active');
        }
    });


    $("#createFetchContactsNavLink").on("click", function (e) {
        hideAndClearReviewJob();
        let fetchContactsTab = $("#fetchContactsTab");
        let uploadFileTab = $("#uploadFileTab");

        fetchContactsTab.addClass('active');
        fetchContactsTab.addClass('show');
        uploadFileTab.removeClass('active');
        uploadFileTab.removeClass('show');

        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $('#uploadFileNavLink').removeClass('active')
        }

    });

    $("#uploadFileNavLink").on("click", function (e) {
        hideAndClearReviewJob();
        let fetchContactsTab = $("#fetchContactsTab");
        let uploadFileTab = $("#uploadFileTab");

        uploadFileTab.addClass('active');
        uploadFileTab.addClass('show');
        fetchContactsTab.removeClass('active');
        fetchContactsTab.removeClass('show');

        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $('#createFetchContactsNavLink').removeClass('active')
        }

    });


    $("#fetchContactsForm").submit(function (e) {
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        let fetchingContactsLoading = $('#fetchingContactsLoading');


        $.ajax({
            type: "get",
            url: "mass_messages_fetch_contacts?" + $("#fetchContactsForm").serialize(),
            beforeSend: function () {
                $('#fetchingContactsBtn').attr('disabled', true);
                if (!$('#countResult').hasClass('d-none')) {
                    $('#countResult').addClass('d-none')
                }
                hideAndClearReviewJob();
                fetchingContactsLoading.addClass('d-flex');
                fetchingContactsLoading.removeClass('d-none');
            },
            complete: function () {
                fetchingContactsLoading.removeClass('d-flex');
                fetchingContactsLoading.addClass('d-none');
                $('#fetchingContactsBtn').attr('disabled', false);
            },
            success: function (res) {
                isUploadCsv = false;
                isFetch = true;
                let personTypeLabel = $("#personTypeLabel")[0];

                let personTypeName = personTypeLabel.options[personTypeLabel.selectedIndex];

                $('#countResult p').html('We found <strong>' + res.note + '</strong> labeled <strong>' + personTypeName.getAttribute('data-name') + '</strong> including filters.');
                if (res.count && res.count > 0) {
                    fetchedContacts = res.contacts;
                    note = res.note;
                    reviewJobForm.removeClass('d-none');
                } else {
                    hideAndClearReviewJob();
                }

                $('#countResult').removeClass('d-none')
            },
        });
    });

    $('#reviewJobForm').submit(function (e) {
        e.preventDefault();
        let personTypeLabel = $("#personTypeLabel")[0];
        let personTypeName = personTypeLabel.options[personTypeLabel.selectedIndex];

        let formData = {};
        if (isFetch) {
            formData = {
                fv_person_type_id: $("#personTypeLabel").val(),
                fv_person_type_name: personTypeName.getAttribute('data-name'),
                message_body: $('#reviewJobMessage').val(),
                is_upload_csv: 0,
                is_fetch: 1,
                note: note,
                is_exclude_blacklist: $('#isExcludeBlackList').is(":checked") ? 1 : 0,
                contacts: fetchedContacts
            };
        }

        if (isUploadCsv) {
            formData = {
                message_body: $('#reviewJobMessage').val(),
                is_upload_csv: 1,
                is_fetch: 0,
                note: note,
                upload_csv_file_name: csvFileName,
                contacts: fetchedContacts
            };
        }


        sendMassMessage(formData)
    });

    $('#csvFileUploadForm').submit(function (e) {
        e.preventDefault();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        let fetchingCsvContactsLoading = $('#fetchingCsvContactsLoading');

        $.ajax({
            url: "mass_messages_upload_csv",
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function () {
                $('#uploadCsvBtn').attr('disabled', true);
                fetchingCsvContactsLoading.addClass('d-flex');
                fetchingCsvContactsLoading.removeClass('d-none');
                hideAndClearReviewJob()
                if (!$('#countResultCsv').hasClass('d-none')) {
                    $('#countResultCsv').addClass('d-none')
                }
            },
            success: function (res) {
                isUploadCsv = true;
                isFetch = false;
                fetchingCsvContactsLoading.removeClass('d-flex');
                fetchingCsvContactsLoading.addClass('d-none');
                $('#countResultCsv p').html('We found <strong>' + res.count + '</strong> correctly formatted entries in your file.');

                $('#uploadCsvBtn').attr('disabled', false);
                if (res.count && res.count > 0) {
                    fetchedContacts = res.contacts;
                    note = res.note;
                    csvFileName = res.upload_csv_file_name;
                    reviewJobForm.removeClass('d-none');
                } else {
                    hideAndClearReviewJob();
                }

                $('#countResultCsv').removeClass('d-none')
            },
            error: function (xhr, status, e) {
                $('#uploadCsvBtn').attr('disabled', false);
                fetchingCsvContactsLoading.removeClass('d-flex');
                fetchingCsvContactsLoading.addClass('d-none');
                Swal.fire({
                    text: JSON.parse(xhr.responseText).data,
                    icon: "error",
                })
            }
        });
    });

    function sendMassMessage(data) {
        Swal.fire({
            title: 'You are about to send ' + data.contacts.length + ' text messages.',
            showDenyButton: true,
            icon: "warning",
            confirmButtonColor: "#0BB7AF",
            cancelButtonColor: "#fa5f6a",
            showCancelButton: false,
            confirmButtonText: 'Send Now',
            denyButtonText: `Cancel`,
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    type: "post",
                    url: "mass_messages_send_messages",
                    dataType: "JSON",
                    data: data,
                    beforeSend: function () {
                        $('#reviewJobForm button').attr('disabled', true)
                    },
                    complete: function () {
                        $('#reviewJobForm button').attr('disabled', false)
                    },
                    success: function (res) {
                        Swal.fire({
                            text: 'Your Mass Text Job Is Queued! Please Refresh the Page and Review Logs for Progress.',
                            icon: "success",
                        });
                    },
                });
            }
        });
    }

    function hideAndClearReviewJob() {
        fetchedContacts = [];
        csvFileName = 'false';
        isUploadCsv = false;
        isFetch = true;
        if (!reviewJobForm.hasClass('d-none')) {
            reviewJobForm.addClass('d-none')
        }
    }

    $(document).on("click", ".show-mass-message-logs", function (e) {
        let url = "mass_messages_logs/" + $(this).data('id');
        $('#kt_datatable_mass_messages_logs').html('');

        $('#kt_datatable_mass_messages_logs').KTDatatable({
            message: true,
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: url,
                        method: 'get',
                        map: function (raw) {
                            var dataSet = raw.data;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
            },
            columns: [
                {
                    title: 'Client Name',
                    field: 'person_name',
                },
                {
                    title: 'Client Number',
                    field: 'person_number',
                },
                {
                    title: 'Created At',
                    field: 'created_at',
                    template: function (row) {
                        return '<span>' + moment(row.created_at).format('YYYY-MM-DD HH:MM'); + '</span>';
                    },
                },
                {
                    title: 'Sent At',
                    field: 'sent_at',
                    template: function (row) {
                        if (row.sent_at) {
                            return '<span>' + moment(row.sent_at).format('YYYY-MM-DD HH:MM'); + '</span>';
                        } else {
                            return '';
                        }
                    },
                },
                {
                    title: 'Status',
                    field: 'is_sent',
                    template: function (row) {
                        return row.is_sent ? '<img src="/assets/img/green-checkmark.png" class="w-20px">' : '';
                    },
                },
                {
                    title: 'Note',
                    field: 'note',
                    template: function (row) {
                        return (row.note !== null && row.note.length) ? '<textarea rows="5">' + row.note + '</textarea>' : '';
                    },
                },
                {
                    title: 'Retry',
                    field: 'id',
                    template: function (row) {
                        return row.failed_count ? '<a type="button" data-value="' + row.id + '"  class="btn btn-success recreate-job">Send</a>' : '';
                    },
                },
            ]
        });

    });


    $("input[name=csv_file]").on('change', (function (e) {
        $(".file-upload-button").html($("input[name=csv_file]")[0].files.item(0).name);
    }));

    $("select[name=person_type]").on('change', (function (e) {
        let person_type = $(this).val();
        if (person_type == 24322) {
            $(".exclude_blacklist_div").removeClass("d-none");
        } else {
            $('#isExcludeBlackList').prop('checked', false);
            $(".exclude_blacklist_div").addClass("d-none");
        }
    }));


    $(function () {
        var log_start_date = moment();
        var log_end_date = moment();

        function cb(start, end) {
            $('#logreportrange span').html(start.format('MM/D/YYYY') + ' - ' + end.format('MM/D/YYYY'));

            let export_href = $(".export-custom-log").attr("href");
            export_href = export_href.split("?")[0] + '?log_start_date=' + start.format('YYYY-MM-DD') + '&log_end_date=' + end.format('YYYY-MM-DD');
            $(".export-custom-log").attr("href", export_href);

            $('#kt_datatable_mass_messages_custom_logs').html('');

            $('#kt_datatable_mass_messages_custom_logs').KTDatatable({
                message: true,
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: 'mass_messages_custom_logs',
                            method: 'get',
                            data: {
                                'log_start_date': start.format('YYYY-MM-DD'),
                                'log_end_date': end.format('YYYY-MM-DD'),
                            },
                            map: function (raw) {
                                var dataSet = raw.data;
                                if (typeof raw.data !== 'undefined') {
                                    dataSet = raw.data;
                                }
                                if (raw.data.length) {
                                    $(".datatable").removeClass("datatable-error");
                                } else {
                                    $(".datatable").addClass("datatable-error");
                                }
                                return dataSet;
                            },
                        },
                    },
                },
                columns: [
                    {
                        title: 'Client Name',
                        field: 'person_name',
                    },
                    {
                        title: 'Client Number',
                        field: 'person_number',
                        template: function (row) {
                            return '+1' + row.person_number;
                        },
                    },
                    {
                        title: 'Message Body',
                        field: 'message_body',
                        template: function (row) {
                            return '<span>' + (row.message_body.length > 100 ? row.message_body.substring(0, 99) + '<a type="button" data-toggle="modal" data-value="' + row.message_body + '" data-target="#messageBodyDetails" class="text-dark message-body-details">....</a>' : row.message_body) + '</span>';
                        },
                    },
                    {
                        title: 'Created At',
                        field: 'created_at',
                        template: function (row) {
                            return '<span>' + moment(row.created_at).format('YYYY-MM-DD HH:MM'); + '</span>';
                        },
                    },
                    {
                        title: 'Sent At',
                        field: 'sent_at',
                        template: function (row) {
                            if (row.sent_at) {
                                return '<span>' + moment(row.sent_at).format('YYYY-MM-DD HH:MM'); + '</span>';
                            } else {
                                return '';
                            }
                        },
                    },
                    {
                        title: 'Status',
                        field: 'is_sent',
                        template: function (row) {
                            return row.is_sent ? '<img src="/assets/img/green-checkmark.png" class="w-20px">' : '';
                        },
                    },
                    {
                        title: 'Note',
                        field: 'note',
                        template: function (row) {
                            return (row.note !== null && row.note.length) ? '<textarea rows="5">' + row.note + '</textarea>' : '';
                        },
                    },
                    {
                        title: 'Retry',
                        field: 'id',
                        template: function (row) {
                            return row.failed_count ? '<a type="button" data-value="' + row.id + '"  class="btn btn-success recreate-job">Send</a>' : '';
                        },
                    },
                ]
            });
        }

        $('#logreportrange').daterangepicker({
            startDate: log_start_date,
            endDate: log_end_date,
            ranges: {
                'Today': [moment(), moment()],
                'This Week': [moment().startOf('isoWeek'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
            }
        }, cb);
        cb(log_start_date, log_end_date);
    });

});


$(document).on('click', 'button.remove', function () {
    let mass_messages_id = $(this).attr('data-id');
    Swal.fire({
        title: 'Are you sure want to delete?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: "post",
                url: "mass_messages_delete",
                dataType: "JSON",
                data: {
                    mass_messages_id: mass_messages_id
                },
                success: function (response) {
                    Swal.fire({
                        text: response.message,
                        icon: "success",
                    }).then(function () {
                        location.reload();
                    });
                },
            });
        }
    });
});


var BasicDatatablesDataSourceHtml = function () {
    var massMessageDatatable = function () {
        var table = $('#mass_message_datatable');
        table.DataTable({
            responsive: true,
            bDestroy: true,
            order: [[0, "desc"]]
        });
    };
    return {
        init: function () {
            massMessageDatatable();
        },
    };
}();

var BasicDatatablesDataSourceHtml2 = function () {
    var massMessageLogDatatable = function () {
        var table = $('#mass_message_log_datatable');
        table.DataTable({
            responsive: true,
            bDestroy: true
        });
    };
    return {
        init: function () {
            massMessageLogDatatable();
        },
    };
}();

jQuery(document).ready(function () {
    BasicDatatablesDataSourceHtml.init();
    BasicDatatablesDataSourceHtml2.init();
});


$(document).on('click', 'a.message-body-details', function () {
    let mass_messages_body = $(this).attr('data-value');
    $("#mass_messages_body").text(mass_messages_body);
});


$(document).on('click', 'a.recreate-job', function (e) {
    let this_click = $(this);
    let mass_messages_logs_id = $(this).attr('data-value');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $.ajax({
        type: "post",
        url: "mass_messages_recreate_job",
        dataType: "JSON",
        data: {
            mass_messages_logs_id: mass_messages_logs_id
        },
        success: function (response) {
            this_click.html("Sent");
            this_click.addClass("disabled");
            Swal.fire({
                text: response.message,
                icon: "success",
            });
        },
    });

});


function copyContent(element, text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
    $('.copy-button').attr('title', 'Copy')
        .tooltip('_fixTitle');
    $(element).attr('title', 'Copied')
        .tooltip('_fixTitle')
        .tooltip('show');
}
