import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import axios from "axios"
import { useEffect, useState } from 'react'
import { Input } from '@chakra-ui/react'
import { Center, Flex, Box, Text } from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const apiUrl = `${apiBaseUrl}/todos`;
axios.defaults.headers.common = {'X-Api-Key': apiKey};

const fetcher = url => axios.get(url).then(res => res.data);

export default function Home() {

  //const poster = (data: any) => async (url: string) => await axios({method: 'post', url, data }).then((res) => res.data);
  const { data, error } = useSWR(apiUrl, fetcher);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(()=> {
    if(data){
      setTodos(data.Items);
    }
  }, [data])

  const handleSave = async (event) => {
    await axios.post(apiUrl, { 
      title: title,
      message: message,
    })
    const { Items } = await fetcher(apiUrl);
    if(Items){
      setTodos(Items);
    }
    setTitle('');
    setMessage('');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TODO</title>
        <meta name="description" content="TODO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Box><Text fontSize="4xl">My Simple TODO Application</Text></Box>
      <Flex w={'100%'}>
        <Box flex='1'>
          <Accordion>
            {
              todos.map((row, index) => {
                return (
                  <AccordionItem key={row.id}>
                    <h2>
                      <AccordionButton>
                        <Box flex='1' textAlign='left'>Title: {row.title}</Box><AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {row.message}
                    </AccordionPanel>
                  </AccordionItem>
                )
              })
            }
          </Accordion>
        </Box>
        <Center w='400px'>
          <Box m={2} p={2} borderWidth='1px' borderRadius='lg'>
            <Box my={2} mx={1}><Text>Create TODO entry</Text></Box>
            <Box my={2} mx={1}><Input placeholder='Title' value={title} onChange={(event) => { setTitle(event.target.value) }}/></Box>
            <Box my={2} mx={1}><Input placeholder='Message' value={message} onChange={(event) => { setMessage(event.target.value) }}/></Box>
            <Box my={2} mx={1}><Button colorScheme='teal' onClick={handleSave}>Save</Button></Box>
          </Box>
        </Center>
      </Flex>
      </main>
    </div>
  )
}
