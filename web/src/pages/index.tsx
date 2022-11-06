import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logo from '../assets/logo.svg'
import avatares from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import Image from 'next/image'
import { api } from '../../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

  try {
    const response = await api.post('/pools', {
      title: poolTitle,
    });

    const { code } = response.data
    await navigator.clipboard.writeText(code)

    alert('Bolão criado com sucesso, o código foi copiado para a área de transferência!')
    setPoolTitle('')
  } 
  catch (err) {
    console.log(err)
    alert('Falha ao criar o bolão.')
  }
}
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logo} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre os amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2 ">
          <Image src={avatares} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            type="text"
            className="flex-1 px-6 py-4 rounded border-gray-600 bg-gray-800 text-sm text-white"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-sm text-gray-900 uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-gray-300 text-sm mt-4 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100 items-center">
          <div className="flex items-center gap-6">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6 ">
            <Image src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImage}
        alt="Dois smart-phones exibindo uma prévia da aplicação móvel do NLW Copa"
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] =
    await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count')
    ])
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: usersCountResponse.data.count
    }
  }
}
