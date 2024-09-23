import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async(req: NextRequest, {params}: {params: {id: string}}) => {
  const {id} = params

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({status: 'OK', post: post}, {status: 200})
  } catch(error) {
    if(error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400})
  }
}

type UpdatePostRequestBody = {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }, 
) => {

  const { id } = params

  const { title, content, categories, thumbnailUrl }: UpdatePostRequestBody = await request.json()

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    })

    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      })
    }

    return NextResponse.json({ status: 'OK', post: post }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const DELETE = async(req: Request, {params}: {params: {id: string}},) => {
  const {id} = params

  try {

    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({status: 'OK'}, {status: 200})
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400})
  }
}