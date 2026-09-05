export type SmsSendResult = {
  stub: boolean
  queued: boolean
  provider?: string
  error?: string
}

/**
 * SMS adapter — Twilio when SMS_PROVIDER=twilio + credentials exist.
 */
export async function sendSms(phone: string, message: string): Promise<SmsSendResult> {
  const provider = (process.env.SMS_PROVIDER || '').toLowerCase()
  const apiKey = process.env.SMS_API_KEY
  const apiSecret = process.env.SMS_API_SECRET
  const from = process.env.SMS_FROM

  if (!provider || !apiKey) {
    console.info('[sms-stub]', phone, message.slice(0, 80))
    return { stub: true, queued: false, provider: 'none' }
  }

  if (provider === 'twilio') {
    if (!apiSecret || !from) {
      return { stub: true, queued: false, provider: 'twilio', error: 'missing Twilio SID/from' }
    }
    try {
      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
      const body = new URLSearchParams({
        To: phone.startsWith('+') ? phone : `+${phone}`,
        From: from,
        Body: message,
      })
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${apiKey}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        }
      )
      if (!res.ok) {
        const text = await res.text()
        console.error('[sms-twilio]', res.status, text)
        return { stub: false, queued: false, provider: 'twilio', error: text.slice(0, 200) }
      }
      return { stub: false, queued: true, provider: 'twilio' }
    } catch (err) {
      console.error(err)
      return {
        stub: false,
        queued: false,
        provider: 'twilio',
        error: err instanceof Error ? err.message : 'send failed',
      }
    }
  }

  console.info('[sms-stub-unknown-provider]', provider, phone)
  return { stub: true, queued: false, provider }
}
