// 환경 변수 확인 스크립트
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
]

console.log('환경 변수 확인 중...\n')

let allSet = true
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value || value.includes('your_')) {
    console.log(`❌ ${varName}: 설정되지 않음`)
    allSet = false
  } else {
    console.log(`✅ ${varName}: 설정됨`)
  }
})

if (!allSet) {
  console.log('\n⚠️  일부 환경 변수가 설정되지 않았습니다.')
  console.log('.env.local 파일을 확인하고 Supabase 설정 값을 입력하세요.')
  process.exit(1)
} else {
  console.log('\n✅ 모든 환경 변수가 설정되었습니다!')
}

