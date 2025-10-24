const id = {
  errors: {
    general: {
      serverError: "Terjadi kesalahan server",
      networkError: "Terjadi kesalahan jaringan",
      unauthorized: "Diperlukan autentikasi",
      forbidden: "Akses ditolak",
      notFound: "Sumber daya tidak ditemukan",
      validationError: "Data input tidak valid",
      conflict: "Terjadi konflik data",
      unexpectedError: "Terjadi kesalahan yang tidak terduga",
      unknownError: "Terjadi kesalahan yang tidak diketahui",
      targetNotFound: "Target pembaruan tidak ditemukan",
      operationFailed: "Eksekusi operasi gagal",
      processingError: "Terjadi kesalahan saat pemrosesan",
      relatedResourceDeleteError: "Kesalahan saat menghapus sumber daya terkait",
      partialOperationFailed: "Beberapa operasi gagal",
      rollbackFailed: "Proses rollback gagal"
    },
    auth: {
      notAuthenticated: "Belum diautentikasi",
      insufficientPermissions: "Izin tidak mencukupi",
      accessDenied: "Akses ditolak",
      companyNotSet: "Informasi perusahaan belum diatur",
      adminRightsRequired: "Diperlukan hak administrator",
      adminPermissionRequired: "Diperlukan izin administrator",
      codeIncorrect: "Kode verifikasi salah",
      codeExpired: "Kode verifikasi telah kedaluwarsa",
      userNotFound: "Pengguna tidak ditemukan",
      signInFailed: "Gagal masuk",
      credentialsIncorrect: "Alamat email atau kata sandi salah",
      accountNotConfirmed: "Akun belum dikonfirmasi. Silakan selesaikan verifikasi email",
      passwordResetRequired: "Diperlukan reset kata sandi",
      userNotAuthenticated: "Pengguna tidak terautentikasi",
      getCurrentUserFailed: "Gagal mendapatkan pengguna saat ini",
      missingParameters: "Parameter yang diperlukan hilang: userId, email",
      check2FAStatusFailed: "Gagal memeriksa status 2FA",
      missingEmailParameters: "Parameter yang diperlukan hilang: userId, newEmail, userPoolId",
      invalidEmailFormat: "Format email tidak valid",
      cognitoEmailUpdateSuccess: "Email Cognito berhasil diperbarui",
      cognitoEmailUpdateFailed: "Gagal memperbarui email Cognito",
      userNotFoundInCognito: "Pengguna tidak ditemukan di Cognito",
      invalidEmailOrUserId: "Format email tidak valid atau ID pengguna",
      notAuthorizedToUpdateUser: "Tidak diizinkan untuk memperbarui pengguna",
      missingUsernameParameters: "Parameter yang diperlukan hilang: userId, newUsername, userPoolId",
      invalidUsernameFormat: "Format nama pengguna tidak valid",
      cognitoUsernameUpdateSuccess: "Nama pengguna Cognito berhasil diperbarui",
      cognitoUsernameUpdateFailed: "Gagal memperbarui nama pengguna Cognito",
      invalidUsernameOrUserId: "Format nama pengguna tidak valid atau ID pengguna",
      usernameAlreadyExists: "Nama pengguna sudah ada",
      missingVerificationParameters: "Parameter yang diperlukan hilang: userId, email, code, userPoolId",
      verificationCodeNotFound: "Kode verifikasi tidak ditemukan atau kedaluwarsa",
      verificationCodeExpired: "Kode verifikasi telah kedaluwarsa",
      tooManyFailedAttempts: "Terlalu banyak percobaan yang gagal",
      invalidVerificationCode: "Kode verifikasi tidak valid",
      emailVerificationSuccess: "Verifikasi email berhasil dan Cognito diperbarui",
      emailVerificationFailed: "Gagal memverifikasi kode email",
      missingStoreParameters: "Parameter yang diperlukan hilang: userId, email, code, userType",
      verificationCodeStoredSuccess: "Kode verifikasi berhasil disimpan",
      verificationCodeStoreFailed: "Gagal menyimpan kode verifikasi"
    },
    validation: {
      userIdRequired: "ID pengguna wajib diisi",
      customerIdRequired: "ID pelanggan wajib diisi",
      groupIdRequired: "ID grup wajib diisi",
      policyIdRequired: "ID kebijakan wajib diisi",
      supportRequestIdRequired: "ID permintaan dukungan wajib diisi",
      newOrderRequestIdRequired: "ID permintaan baru wajib diisi",
      statusRequired: "Status wajib diisi",
      userGroupIdRequired: "ID grup pengguna wajib diisi",
      groupIdRequiredForValidation: "ID grup wajib diisi",
      userIdRequiredForValidation: "ID pengguna wajib diisi",
      fieldRequired: "Kolom ini wajib diisi",
      validEmailRequired: "Masukkan alamat email yang valid",
      minLength: "Minimal {count} karakter",
      maxLength: "Maksimal {count} karakter",
      passwordMinLength: "Kata sandi minimal 8 karakter",
      passwordUppercase: "Harus menyertakan huruf besar",
      passwordLowercase: "Harus menyertakan huruf kecil",
      passwordNumber: "Harus menyertakan angka",
      passwordSpecialChar: "Harus menyertakan karakter khusus",
      passwordMismatch: "Kata sandi tidak cocok",
      userNameRequired: "Nama pengguna wajib diisi",
      emailRequired: "Email wajib diisi",
      companyIdRequired: "ID perusahaan wajib diisi",
      departmentRequired: "Departemen wajib diisi",
      positionRequired: "Jabatan wajib diisi",
      roleRequired: "Peran wajib diisi",
      usageMinZero: "Penggunaan harus 0 atau lebih",
      positiveNumber: "Harus berupa nilai positif",
      nonNegativeNumber: "Harus 0 atau lebih besar",
      invalidEmail: "Masukkan alamat email yang valid",
      required: "Kolom ini wajib diisi",
      policyIdsMinOne: "Pilih setidaknya satu kebijakan",
      userIdsMinOne: "Pilih setidaknya satu pengguna",
      emailsMinOne: "Cantumkan setidaknya satu alamat email",
      emailsValid: "Masukkan alamat email yang valid",
      invalidExceedAction: "Pilih beri tahu atau batasi untuk tindakan saat melebihi",
      invalidNotifyType: "Pilih jumlah atau penggunaan untuk metode pemberitahuan",
      invalidUnit: "Pilih KB, MB, GB, atau TB sebagai satuan",
      invalidAiTrainingUsage: "Pilih izinkan atau tolak untuk penggunaan pelatihan AI",
      invalidStatus: "Pilih OPEN, IN_PROGRESS, atau CLOSED sebagai status",
      invalidIssueType: "Pilih teknis, akun, penagihan, atau lainnya sebagai jenis masalah",
      invalidAction: "Pilih READ, CREATE, UPDATE, DELETE, ATTACH, atau DETACH sebagai tindakan",
      invalidResource: "Jenis sumber daya tidak valid",
      invalidDataType: "Pilih tabel, gambar, atau teks sebagai jenis data",
      invalidModelType: "Pilih clustering, prediction, atau classification sebagai jenis model",
      notifyTypeAmountRequired: "Masukkan jumlah atau penggunaan sesuai metode pemberitahuan",
      notifyTypeUsageRequired: "Saat memilih pemberitahuan penggunaan, satuan wajib",
      usageUnitRequired: "Saat memilih pemberitahuan penggunaan, satuan wajib",
      companyNameRequired: "Nama perusahaan wajib diisi",
      stateRequired: "Provinsi/Negeri wajib diisi",
      cityRequired: "Kota wajib diisi",
      streetAddressRequired: "Alamat wajib diisi",
      groupNameRequired: "Nama grup wajib diisi",
      policyNameRequired: "Nama kebijakan wajib diisi",
      subjectRequired: "Subjek wajib diisi",
      descriptionRequired: "Deskripsi wajib diisi",
      messageRequired: "Pesan wajib diisi",
      resourceNameRequired: "Nama sumber daya wajib diisi",
      preferredUsernameRequired: "Nama pengguna wajib diisi",
      localeRequired: "Locale wajib diisi",
      confirmationCodeRequired: "Kode verifikasi wajib diisi",
      challengeResponseRequired: "Respons tantangan wajib diisi",
      limitUsageIdRequired: "ID batas penggunaan wajib diisi",
      isStaffInvalid: "Tanda staf harus bernilai boolean"
    },
    user: {
      fetchFailed: "Gagal mengambil informasi pengguna",
      accessDenied: "Akses ke informasi pengguna ini ditolak",
      notFound: "Pengguna tidak ditemukan",
      companyAccessDenied: "Akses ke informasi pengguna perusahaan ini ditolak",
      batchFetchFailed: "Kesalahan saat mengambil beberapa informasi pengguna",
      updateFailed: "Gagal memperbarui informasi pengguna",
      createFailed: "Gagal membuat pengguna",
      deleteFailed: "Gagal menghapus pengguna",
      userGroupFetchFailed: "Gagal mengambil informasi grup pengguna",
      userGroupDeleteFailed: "Gagal menghapus grup pengguna",
      rollbackFailed: "Gagal melakukan rollback penghapusan",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan",
      updateError: "Kesalahan saat memperbarui pengguna",
      userNameEmpty: "Nama pengguna tidak boleh kosong",
      emailEmpty: "Email tidak boleh kosong",
      departmentEmpty: "Departemen tidak boleh kosong",
      positionEmpty: "Posisi tidak boleh kosong",
      roleEmpty: "Peran tidak boleh kosong",
      fieldRequired: "{field} wajib diisi"
    },
    policy: {
      fetchFailed: "Gagal mengambil informasi kebijakan",
      accessDenied: "Akses ke informasi kebijakan ini ditolak",
      batchFetchFailed: "Kesalahan saat mengambil beberapa informasi kebijakan pelanggan",
      createFailed: "Gagal membuat kebijakan",
      updateFailed: "Gagal memperbarui kebijakan",
      deleteFailed: "Gagal menghapus kebijakan",
      idRequired: "ID kebijakan yang valid wajib diisi",
      notFound: "Kebijakan yang ditentukan tidak ditemukan",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan",
      updateError: "Kesalahan saat memperbarui kebijakan"
    },
    group: {
      fetchFailed: "Gagal mengambil grup",
      accessDenied: "Akses ditolak",
      listFetchFailed: "Gagal mengambil daftar grup",
      updateFailed: "Gagal memperbarui grup",
      createFailed: "Gagal membuat grup",
      deleteFailed: "Gagal menghapus grup",
      userGroupDeleteFailed: "Gagal menghapus grup pengguna",
      groupPolicyDeleteFailed: "Gagal menghapus kebijakan grup",
      rollbackFailed: "Gagal melakukan rollback"
    },
    userGroup: {
      fetchFailed: "Gagal mengambil informasi grup pengguna",
      accessDenied: "Akses ke informasi grup pengguna ini ditolak",
      batchFetchFailed: "Kesalahan saat mengambil beberapa informasi grup pengguna",
      companyFetchFailed: "Gagal mengambil berdasarkan ID pelanggan",
      groupFetchFailed: "Gagal mengambil berdasarkan ID grup",
      userFetchFailed: "Gagal mengambil berdasarkan ID pengguna",
      membershipCheckFailed: "Gagal memeriksa keanggotaan grup",
      createFailed: "Gagal membuat grup pengguna",
      updateFailed: "Gagal memperbarui grup pengguna",
      deleteFailed: "Gagal menghapus grup pengguna",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan",
      updateError: "Kesalahan saat memperbarui grup pengguna"
    },
    groupPolicy: {
      fetchFailed: "Gagal mengambil informasi kebijakan grup",
      accessDenied: "Akses ke informasi kebijakan grup ini ditolak",
      batchFetchFailed: "Kesalahan saat mengambil beberapa informasi kebijakan grup",
      policyFetchFailed: "Gagal mengambil berdasarkan ID kebijakan",
      groupFetchFailed: "Gagal mengambil berdasarkan ID grup",
      createFailed: "Gagal membuat kebijakan grup",
      deleteFailed: "Gagal menghapus kebijakan grup"
    },
    supportRequest: {
      fetchFailed: "Gagal mengambil permintaan dukungan",
      accessDenied: "Akses ke permintaan dukungan ini ditolak",
      notFound: "Permintaan dukungan dengan ID yang ditentukan tidak ditemukan",
      otherCompanyAccessDenied: "Akses ke informasi permintaan dukungan perusahaan lain ditolak",
      userAccessDenied: "Akses ke informasi permintaan dukungan pengguna ini ditolak",
      batchFetchFailed: "Kesalahan saat mengambil beberapa permintaan dukungan",
      statusBatchFetchFailed: "Kesalahan saat mengambil beberapa status permintaan dukungan",
      userBatchFetchFailed: "Kesalahan saat mengambil beberapa informasi dukungan pengguna",
      customerBatchFetchFailed: "Kesalahan saat mengambil beberapa informasi dukungan pelanggan",
      createFailed: "Gagal membuat permintaan dukungan",
      updateFailed: "Gagal memperbarui permintaan dukungan",
      deleteFailed: "Gagal menghapus permintaan dukungan",
      validationError: "Ada masalah dengan masukan permintaan dukungan",
      updateError: "Kesalahan saat memperbarui permintaan dukungan",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan"
    },
    supportReply: {
      fetchFailed: "Gagal mengambil balasan dukungan",
      accessDenied: "Akses ke balasan dukungan ini ditolak",
      createFailed: "Gagal membuat balasan dukungan",
      updateFailed: "Gagal memperbarui balasan dukungan",
      deleteFailed: "Gagal menghapus balasan dukungan",
      notFound: "Balasan dukungan dengan ID yang ditentukan tidak ditemukan",
      updateError: "Kesalahan saat memperbarui balasan dukungan",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan"
    },
    newOrder: {
      fetchFailed: "Gagal mengambil informasi permintaan baru",
      accessDenied: "Akses ke informasi ini ditolak",
      notFound: "Permintaan baru dengan ID yang ditentukan tidak ditemukan",
      otherCompanyAccessDenied: "Akses ke informasi permintaan baru perusahaan lain ditolak",
      batchFetchFailed: "Kesalahan saat mengambil beberapa informasi permintaan baru",
      customerBatchFetchFailed: "Kesalahan saat mengambil beberapa informasi pelanggan"
    },
    newOrderRequest: {
      createFailed: "Gagal membuat permintaan baru",
      updateFailed: "Gagal memperbarui permintaan baru",
      deleteFailed: "Gagal menghapus permintaan baru"
    },
    newOrderReply: {
      fetchFailed: "Gagal mengambil balasan permintaan baru",
      createFailed: "Gagal membuat balasan permintaan baru",
      updateFailed: "Gagal memperbarui balasan permintaan baru",
      deleteFailed: "Gagal menghapus balasan permintaan baru"
    },
    auditLog: {
      customerIdRequired: "ID pelanggan wajib diisi",
      userIdOrCustomerIdRequired: "ID pengguna atau ID pelanggan wajib diisi",
      resourceNameOrCustomerIdRequired: "Nama sumber daya atau ID pelanggan wajib diisi",
      createFailed: "Gagal membuat log audit",
      validationFailed: "Validasi log audit gagal",
      recordFailed: "Gagal merekam log audit"
    },
    dataUsage: {
      userIdRequired: "ID pengguna wajib diisi",
      customerIdRequired: "ID pelanggan wajib diisi",
      fetchFailed: "Gagal mengambil informasi penggunaan data",
      createFailed: "Gagal membuat catatan penggunaan data",
      updateFailed: "Gagal memperbarui penggunaan data",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan",
      updateFieldRequired: "Tentukan setidaknya satu bidang untuk diperbarui",
      notFound: "Catatan penggunaan data untuk diperbarui tidak ditemukan",
      updateError: "Kesalahan saat memperbarui penggunaan data"
    },
    limitUsage: {
      createFailed: "Gagal membuat batas penggunaan",
      updateFailed: "Gagal memperbarui batas penggunaan",
      deleteFailed: "Gagal menghapus batas penggunaan",
      deleteOperationFailed: "Gagal menghapus batas penggunaan",
      deleteProcessingError: "Kesalahan saat memproses penghapusan",
      unknownResource: "Tidak diketahui"
    },
    recipient: {
      fetchFailed: "Gagal mengambil informasi penerima",
      accessDenied: "Akses ke informasi penerima ini ditolak",
      notFound: "Penerima tidak ditemukan",
      createFailed: "Gagal membuat penerima",
      updateFailed: "Gagal memperbarui penerima",
      deleteFailed: "Gagal menghapus penerima",
      limitUsageIdRequired: "ID batas penggunaan wajib diisi",
      noUpdateFields: "Tidak ada bidang pembaruan yang ditentukan",
      updateError: "Kesalahan saat memperbarui penerima",
      createError: "Kesalahan saat membuat penerima",
      partialUpdateFailed: "Gagal memperbarui beberapa penerima"
    },
    delete: {
      userDeleteFailed: "Gagal menghapus pengguna",
      cognitoUserDeleteFailed: "Gagal menghapus pengguna Cognito",
      partialDeleteFailed: "Gagal membatalkan permintaan penghapusan untuk sebagian atau seluruh pengguna",
      authDeleteFailed: "Gagal menghapus informasi autentikasi",
      dbDeleteFailed: "Gagal menghapus pengguna basis data",
      cancelRequestFailed: "Terjadi kesalahan saat membatalkan permintaan penghapusan",
      cancelRequestProcessingError: "Terjadi kesalahan selama pembatalan permintaan penghapusan",
      userDeleteSuccess: "Pengguna berhasil dihapus",
      cognitoUserDeleteSuccess: "Pengguna Cognito berhasil dihapus",
      relatedResourceDeleteError: "Kesalahan saat menghapus sumber daya terkait",
      userNotFoundForDeletion: "Pengguna yang akan dihapus tidak ditemukan",
      bulkDeleteNoTargets: "Tidak ada target penghapusan yang ditentukan",
      bulkDeletePartialFailure: "Gagal menghapus beberapa pengguna",
      cancelDeletionSuccess: "Pembatalan permintaan penghapusan selesai untuk {count} pengguna",
      cancelDeletionPartialFailure: "Berhasil: {successCount}, Gagal: {failCount}",
      lastAdminDeleteNotAllowed: "Tidak dapat menghapus admin terakhir"
    },
    cognito: {
      usernameExists: "Pengguna sudah terdaftar",
      invalidParameter: "Parameter tidak valid",
      invalidPassword: "Kata sandi tidak valid",
      confirmationCodeIncorrect: "Kode verifikasi salah",
      confirmationCodeExpired: "Kode verifikasi telah kedaluwarsa",
      userCreationFailed: "Gagal membuat pengguna Cognito",
      confirmationFailed: "Gagal mengonfirmasi pendaftaran",
      userNotFound: "Pengguna tidak ditemukan",
      emailSendFailed: "Gagal mengirim email",
      signInFailed: "Gagal masuk",
      passwordResetRequired: "Diperlukan reset kata sandi",
      accountNotConfirmed: "Akun belum dikonfirmasi. Harap selesaikan verifikasi email"
    },
    stripe: {
      customerCreationFailed: "Gagal membuat pelanggan Stripe",
      customerNotFound: "Pelanggan tidak ditemukan",
      setupIntentCreationFailed: "Gagal membuat Setup Intent",
      paymentMethodNotFound: "Metode pembayaran tidak ditemukan",
      paymentMethodDetachFailed: "Gagal memutus metode pembayaran",
      paymentHistoryFetchFailed: "Gagal mengambil riwayat pembayaran",
      defaultPaymentMethodSetFailed: "Gagal menetapkan metode pembayaran bawaan",
      addressUpdateFailed: "Gagal memperbarui alamat",
      invalidLocale: "Locale yang ditentukan tidak valid",
      customerIdRequired: "ID pelanggan wajib diisi",
      paymentMethodIdRequired: "ID metode pembayaran wajib diisi",
      addressRequired: "Alamat wajib diisi",
      nameRequired: "Nama wajib diisi",
      emailRequired: "Email wajib diisi",
      userAttributesRequired: "Atribut pengguna wajib diisi",
      invalidAddress: "Format alamat tidak valid",
      stripeError: "Terjadi kesalahan API Stripe",
      updateFailed: "Gagal memperbarui",
      validationError: "Ada masalah dengan input",
      cardError: "Kesalahan kartu",
      requestError: "Kesalahan permintaan",
      apiError: "Kesalahan API",
      connectionError: "Terjadi kesalahan koneksi",
      authenticationError: "Terjadi kesalahan autentikasi"
    },
    api: {
      invalidRequest: "Permintaan tidak valid",
      missingParameters: "Parameter wajib hilang",
      serverError: "Kesalahan server internal",
      validationFailed: "Validasi permintaan gagal",
      authenticationRequired: "Diperlukan autentikasi",
      accessDenied: "Akses ditolak",
      notFound: "Sumber daya tidak ditemukan",
      methodNotAllowed: "Metode tidak diizinkan",
      conflictError: "Konflik sumber daya",
      rateLimitExceeded: "Batas permintaan terlampaui"
    },
    verificationEmail: {
      sendFailed: "Gagal mengirim email verifikasi",
      templateNotFound: "Templat email tidak ditemukan",
      messageRejected: "Email ditolak (tujuan mungkin tidak valid)",
      sendingPaused: "Pengiriman email sedang dijeda sementara",
      mailFromDomainNotVerified: "Domain pengirim belum diverifikasi",
      configurationSetNotFound: "Set konfigurasi SES tidak ditemukan",
      invalidTemplate: "Templat email tidak valid",
      invalidAwsCredentials: "Kredensial AWS tidak valid",
      invalidParameters: "Parameter tidak valid"
    }
  },
  "fields": {
    "userName": "Nama pengguna",
    "email": "Email",
    "department": "Departemen",
    "position": "Posisi",
    "role": "Peran"
  },
  messages: {
    dataUsage: {
      createSuccess: "Catatan penggunaan data berhasil dibuat",
      updateSuccess: "Penggunaan data berhasil diperbarui"
    },
    policy: {
      createSuccess: "Kebijakan berhasil dibuat",
      updateSuccess: "Kebijakan berhasil diperbarui",
      deleteSuccess: "Kebijakan berhasil dihapus"
    },
    user: {
      createSuccess: "Pengguna berhasil dibuat",
      updateSuccess: "Informasi pengguna berhasil diperbarui",
      deleteSuccess: "Pengguna berhasil dihapus"
    },
    group: {
      createSuccess: "Grup berhasil dibuat",
      updateSuccess: "Grup berhasil diperbarui",
      deleteSuccess: "Grup berhasil dihapus"
    },
    groupPolicy: {
      createSuccess: "Kebijakan grup berhasil dibuat",
      deleteSuccess: "Kebijakan grup berhasil dihapus"
    },
    userGroup: {
      createSuccess: "Grup pengguna berhasil dibuat",
      updateSuccess: "Grup pengguna berhasil diperbarui",
      deleteSuccess: "Grup pengguna berhasil dihapus"
    },
    newOrderRequest: {
      createSuccess: "Permintaan baru berhasil dibuat",
      updateSuccess: "Permintaan baru berhasil diperbarui",
      deleteSuccess: "Permintaan baru berhasil dihapus"
    },
    newOrderReply: {
      createSuccess: "Balasan permintaan baru berhasil dibuat",
      updateSuccess: "Balasan permintaan baru berhasil diperbarui",
      deleteSuccess: "Balasan permintaan baru berhasil dihapus"
    },
    supportRequest: {
      createSuccess: "Permintaan dukungan berhasil dibuat",
      updateSuccess: "Permintaan dukungan berhasil diperbarui",
      deleteSuccess: "Permintaan dukungan berhasil dihapus"
    },
    supportReply: {
      createSuccess: "Balasan dukungan berhasil dibuat",
      updateSuccess: "Balasan dukungan berhasil diperbarui",
      deleteSuccess: "Balasan dukungan berhasil dihapus"
    },
    limitUsage: {
      createSuccess: "Batas penggunaan berhasil dibuat",
      updateSuccess: "Batas penggunaan berhasil diperbarui",
      deleteSuccess: "Batas penggunaan berhasil dihapus"
    },
    recipient: {
      createSuccess: "Penerima berhasil dibuat",
      updateSuccess: "Penerima berhasil diperbarui",
      deleteSuccess: "Penerima berhasil dihapus",
      bulkUpdateSuccess: "Berhasil memperbarui {count} penerima"
    },
    auditLog: {
      createSuccess: "Log audit berhasil dibuat",
      recordSuccess: "Log audit berhasil direkam"
    },
    stripe: {
      customerCreateSuccess: "Pelanggan berhasil dibuat",
      setupIntentCreateSuccess: "Setup Intent berhasil dibuat",
      paymentMethodDeleteSuccess: "Metode pembayaran berhasil dihapus",
      paymentHistoryFetchSuccess: "Riwayat pembayaran berhasil diambil",
      defaultPaymentMethodSetSuccess: "Metode pembayaran bawaan berhasil ditetapkan",
      addressUpdateSuccess: "Alamat berhasil diperbarui"
    },
    api: {
      requestSuccess: "Permintaan berhasil diselesaikan",
      operationCompleted: "Operasi berhasil diselesaikan"
    },
    verificationEmail: {
      sendSuccess: "Email verifikasi telah dikirim"
    },
    cognito: {
      emailVerificationCompleted: "Verifikasi email selesai",
      signInStarted: "Proses masuk dimulai"
    }
  }
} as const;

export default id;


