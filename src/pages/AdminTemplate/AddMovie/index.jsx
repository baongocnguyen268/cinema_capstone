// src/pages/AdminTemplate/AddMovie/index.jsx
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../../../services/api";

const FormSchema = z.object({
  tenPhim: z.string().min(1, "Vui lòng nhập tên phim"),
  trailer: z
    .string()
    .nonempty("Vui lòng nhập thông tin")
    .regex(
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&=]*)/gi,
      "Vui lòng nhập đúng định dạng url"
    ),
  moTa: z
    .string()
    .nonempty("Vui lòng nhập thông tin")
    .max(200, "Nội dung không được vượt quá 200 ký tự"),
  danhGia: z.string().regex(/^([0-9]|10)$/gm, "Vui lòng nhập từ 0 đến 10 "),
  ngayKhoiChieu: z.string().min(1, "Chọn ngày phát hành"),
  maNhom: z.string().optional("GP01"),
  trangThai: z.enum(["true", "false"], { required_error: "Chọn trạng thái" }),
  Hot: z.boolean().optional(),
  hinhAnh: z
    .any()
    .refine((file) => file instanceof File, "Vui lòng chọn poster")
    .refine(
      (file) => ["image/png", "image/jpeg"].includes(file?.type),
      "Chỉ nhận PNG/JPG"
    ),
});

export default function AddMovie() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tenPhim: "",
      trailer: "",
      moTa: "",
      danhGia: "",
      ngayKhoiChieu: "",
      maNhom: "GP01",
      trangThai: false,
      Hot: false,
      hinhAnh: null,
    },
    resolver: zodResolver(FormSchema),
  });

  const file = watch("hinhAnh");
  const previewImage = (file) => {
    if (!file) return "";
    const url = URL.createObjectURL(file);
    return url;
  };
  previewImage(file);

  const onSubmit = async (values) => {
    const { trangThai, Hot, hinhAnh, ngayKhoiChieu, ...rest } = values;

    const newValues = {
      ...rest,
      SapChieu: trangThai === "false",
      DangChieu: trangThai === "true",
      Hot: Boolean(Hot),
      ngayKhoiChieu: format(new Date(ngayKhoiChieu), "dd/MM/yyyy"),
    };

    const formData = new FormData();
    Object.entries(newValues).forEach(([key, val]) =>
      formData.append(key, val)
    );
    formData.append("hinhAnh", hinhAnh, hinhAnh.name);

    try {
      await api.post("/QuanLyPhim/ThemPhimUploadHinh", formData);
      navigate("/admin/movies-management");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">
            Add Movie
          </h1>
          <div className="text-sm text-gray-400 mt-1">
            <Link to="/admin/movies-management" className="hover:underline">
              Movie Management
            </Link>{" "}
            / Add Movie
          </div>
        </div>
        <Link
          to="/admin/movies-management"
          className="px-3 py-2 rounded-lg border border-gray-800 hover:bg-gray-800"
        >
          Cancel
        </Link>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left: fields */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Movie Title
              </label>
              <input
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                placeholder="Enter movie title"
                {...register("tenPhim")}
              />
              {errors.tenPhim && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.tenPhim.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Trailer URL
              </label>
              <input
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                placeholder="https://youtube.com/..."
                {...register("trailer")}
              />
              {errors.trailer && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.trailer.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={5}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                placeholder="Enter description (max 200 chars)"
                {...register("moTa")}
              />
              {errors.moTa && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.moTa.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Rating
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step="1"
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  placeholder="0-10"
                  {...register("danhGia")}
                />
                {errors.danhGia && (
                  <p className="text-xs text-rose-400 mt-1">
                    {errors.danhGia.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Release Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  {...register("ngayKhoiChieu")}
                />
                {errors.ngayKhoiChieu && (
                  <p className="text-xs text-rose-400 mt-1">
                    {errors.ngayKhoiChieu.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Group
                </label>
                <input
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"
                  defaultValue="GP01"
                  {...register("maNhom")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Status</label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    value="true"
                    {...register("trangThai")}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-300">Now Showing</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    value="false"
                    defaultChecked
                    {...register("trangThai")}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-300">Coming Soon</span>
                </label>
                <label className="inline-flex items-center gap-2 ml-auto">
                  <input
                    type="checkbox"
                    {...register("Hot")}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-300">Hot</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: poster upload */}
          <div className="space-y-4">
            <label className="block text-sm text-gray-300">Poster</label>

            {!file ? (
              <>
                <label className="block cursor-pointer rounded-2xl border border-dashed border-gray-700 bg-gray-800/60 p-6 text-center hover:bg-gray-800">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        setValue("hinhAnh", f, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                    }}
                  />
                  <div className="text-gray-400 text-sm">
                    Click to upload poster (PNG/JPG)
                  </div>
                </label>
                {errors.hinhAnh && (
                  <p className="text-xs text-rose-400">
                    {errors.hinhAnh.message}
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <img
                  src={previewImage(file)}
                  alt="preview"
                  className="w-full aspect-[2/3] object-cover rounded-2xl border border-gray-800"
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue("hinhAnh", null, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-800 hover:bg-gray-800"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
