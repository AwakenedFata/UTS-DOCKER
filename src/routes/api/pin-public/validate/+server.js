import { json } from '@sveltejs/kit';
import connectToDatabase from '$lib/server/db.js';
import PinCode from '$lib/server/models/pinCode.js';
import logger from '$lib/server/utils/logger.js';
import { rateLimit } from '$lib/server/utils/rate-limit.js';

// Rate limiter for PIN validation (10 attempts per hour)
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  limit: 10,
})

// Fungsi untuk validasi format PIN 16 digit
const validatePinFormat = (pin) => {
  // Cek tidak ada huruf kecil
  if (/[a-z]/.test(pin)) {
    return { valid: false, reason: "lowercase" }
  }
  // Cek hanya mengandung huruf kapital, angka, dan tanda hubung
  if (!/^[A-Z0-9-]+$/.test(pin)) {
    return { valid: false, reason: "invalid_chars" }
  }
  // Cek panjang: minimal 16, maksimal 21 (16 + prefix 5)
  if (pin.length < 16 || pin.length > 21) {
    return { valid: false, reason: "invalid_length" }
  }
  return { valid: true }
}

export async function POST({ request, getClientAddress }) {
  try {
    // Apply rate limiting
    const ip = request.headers.get("x-forwarded-for") || getClientAddress() || "unknown"
    const limitResult = await limiter.check(ip)

    if (!limitResult.success) {
      return json(
        { error: "Terlalu banyak percobaan validasi pin dari IP ini, silakan coba lagi setelah satu jam" },
        { status: 429 },
      )
    }

    await connectToDatabase()

    const body = await request.json()
    const { pinCode } = body

    if (!pinCode) {
      return json({ error: "Kode pin harus diisi" }, { status: 400 })
    }

    // Validasi format PIN dengan detail error
    const formatValidation = validatePinFormat(pinCode)
    if (!formatValidation.valid) {
      let errorMessage = "PIN code tidak valid"
      
      switch (formatValidation.reason) {
        case "lowercase":
          errorMessage = "PIN code harus huruf kapital semua"
          logger.info(`Percobaan validasi pin gagal: PIN mengandung huruf kecil (${pinCode})`)
          break
        case "invalid_chars":
          errorMessage = "PIN code hanya boleh berisi huruf kapital, angka, dan tanda (-)"
          logger.info(`Percobaan validasi pin gagal: PIN mengandung karakter tidak valid (${pinCode})`)
          break
        case "invalid_length":
          errorMessage = "PIN code harus 16-21 karakter"
          logger.info(`Percobaan validasi pin gagal: PIN panjang tidak sesuai (${pinCode.length} karakter)`)
          break
      }
      
      return json({ error: errorMessage }, { status: 400 })
    }

    // Cari pin di database
    const pin = await PinCode.findOne({ code: pinCode })

    if (!pin) {
      logger.info(`Percobaan validasi pin gagal: Pin tidak ditemukan (${pinCode})`)
      return json({ error: "PIN code tidak ditemukan" }, { status: 404 })
    }

    // Periksa apakah pin masih valid
    if (pin.used) {
      logger.info(`Percobaan validasi pin gagal: Pin sudah digunakan (${pinCode})`)
      return json({ error: "PIN code sudah digunakan" }, { status: 400 })
    }

    // Pin valid
    logger.info(`Pin berhasil divalidasi: ${pinCode} (16 digit)`)
    return json({
      status: "success",
      message: "PIN code valid (16 digit)",
      data: {
        pin: {
          id: pin._id,
          code: pin.code,
          isValid: pin.isValid,
          length: pin.code.length,
        },
      },
    })
  } catch (err) {
    if (err.statusCode === 429) {
      return json({ error: "Terlalu banyak percobaan validasi pin dari IP ini, silakan coba lagi setelah satu jam" }, { status: 429 });
    }
    logger.error(`Error validating pin: ${err.message}`)
    return json({ error: "Terjadi kesalahan saat memvalidasi pin" }, { status: 500 })
  }
}
